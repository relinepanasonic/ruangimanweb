import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

// eslint-config-next 16 ships native flat configs. The FlatCompat shim the app
// still uses (PriskatCFM/eslint.config.mjs) throws a circular-JSON error against
// v16, so import the configs directly instead.
const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
];

export default eslintConfig;
