/**
 * A tiny PostgreSQL `INSERT ... VALUES` tuple parser — just enough to read the
 * app's Supabase seed files (PriskatCFM/supabase/*.sql) into JSON at build
 * time, so the website ships the same data the app has without needing a live
 * database connection.
 *
 * Handles: integers, floats, NULL, single-quoted strings with '' escapes, and
 * `'…'::jsonb` / `'…'::type` casts (the cast is dropped, JSON is parsed).
 * Not a general SQL parser — it assumes well-formed `(a, b, c),` tuples, which
 * is exactly what `pg_dump`-style seed files produce.
 */

/**
 * Parse every row from every `INSERT INTO public.<table> (...) VALUES ...`
 * statement in the file — seed files split large inserts into many statements.
 */
export function parseInsert(sql, table) {
  const marker = `INSERT INTO public.${table}`;
  const rows = [];
  let columns = [];
  let from = 0;
  for (;;) {
    const head = sql.indexOf(marker, from);
    if (head === -1) break;
    from = head + marker.length;
    const one = parseOneInsert(sql, head, table);
    columns = one.columns;
    rows.push(...one.rows);
  }
  return { columns, rows };
}

/** Parse every `( … )` tuple out of one `INSERT INTO … VALUES <tuples>;`. */
function parseOneInsert(sql, head) {
  const colStart = sql.indexOf("(", head) + 1;
  const colEnd = sql.indexOf(")", colStart);
  const columns = sql
    .slice(colStart, colEnd)
    .split(",")
    .map((c) => c.trim());

  const valuesAt = sql.indexOf("VALUES", colEnd);
  let i = valuesAt + "VALUES".length;
  const rows = [];

  while (i < sql.length) {
    // Skip whitespace / commas between tuples.
    while (i < sql.length && /[\s,]/.test(sql[i])) i++;
    if (sql[i] !== "(") break; // hit "ON CONFLICT" / ";" / EOF
    i++; // consume "("

    const values = [];
    while (true) {
      while (i < sql.length && /\s/.test(sql[i])) i++;

      if (sql[i] === "'") {
        // Quoted string, doubled '' is an escaped quote.
        i++;
        let out = "";
        while (i < sql.length) {
          if (sql[i] === "'" && sql[i + 1] === "'") {
            out += "'";
            i += 2;
          } else if (sql[i] === "'") {
            i++;
            break;
          } else {
            out += sql[i++];
          }
        }
        // Optional ::type cast.
        if (sql[i] === ":" && sql[i + 1] === ":") {
          i += 2;
          const t0 = i;
          while (i < sql.length && /[a-z_]/i.test(sql[i])) i++;
          const type = sql.slice(t0, i);
          values.push(type === "jsonb" || type === "json" ? JSON.parse(out) : out);
        } else {
          values.push(out);
        }
      } else {
        // Bare token: number, NULL, true/false.
        const t0 = i;
        while (i < sql.length && !/[,)]/.test(sql[i])) i++;
        const tok = sql.slice(t0, i).trim();
        if (tok === "NULL" || tok === "null") values.push(null);
        else if (tok === "true") values.push(true);
        else if (tok === "false") values.push(false);
        else values.push(Number.isNaN(Number(tok)) ? tok : Number(tok));
      }

      while (i < sql.length && /\s/.test(sql[i])) i++;
      if (sql[i] === ",") {
        i++;
        continue;
      }
      if (sql[i] === ")") {
        i++;
        break;
      }
      // Malformed — bail rather than loop forever.
      throw new Error(`parse-pg-values: unexpected ${JSON.stringify(sql[i])} at ${i}`);
    }

    const row = {};
    columns.forEach((c, idx) => (row[c] = values[idx]));
    rows.push(row);
  }

  return { columns, rows };
}
