// src/svg.d.ts
declare module "*.svg" {
  // если импортируете через `import icon from "...svg"` — получаете URL-строку
  const src: string;
  export default src;
}

declare module "*.svg?component" {
  // если импортируете через `import Icon from "...svg?component"` — получаете React-компонент
  import * as React from "react";
  const Component: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default Component;
}
