import type { Application } from "express";
import { middleware as openApiValidator } from "express-openapi-validator";
import fs from "fs";
import YAML from "js-yaml";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { logger } from "../configs/logger";

const swaggerDir = import.meta.dirname;

const loadYamlFile = (filePath: string) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Swagger YAML file not found: ${filePath}`);
  }

  return YAML.load(fs.readFileSync(filePath, "utf8"));
};

const deepMerge = (target: any, source: any) => {
  for (const key of Object.keys(source)) {
    if (
      source[key] instanceof Object &&
      target[key] instanceof Object &&
      key in target
    ) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }

  return {
    ...target,
    ...source,
  };
};

const mergeComponents = (target: any, source: any) => {
  if (!source.components) {
    return target;
  }

  target.components ??= {};

  for (const section of Object.keys(source.components)) {
    target.components[section] = {
      ...target.components[section],
      ...source.components[section],
    };
  }

  return target;
};

export const setupSwagger = (app: Application) => {
  const swaggerBasePath = path.join(swaggerDir, "swagger.base.yaml");
  const componentsDir = path.join(swaggerDir, "components");
  const schemasDir = path.join(componentsDir, "schemas");
  const modulesDir = path.join(componentsDir, "modules");

  logger.info(`Loading Swagger from: ${swaggerBasePath}`);

  let swaggerDoc: any = loadYamlFile(swaggerBasePath);

  swaggerDoc = mergeComponents(
    swaggerDoc,
    loadYamlFile(path.join(componentsDir, "security.yaml")),
  );
  swaggerDoc = mergeComponents(
    swaggerDoc,
    loadYamlFile(path.join(componentsDir, "response.yaml")),
  );
  swaggerDoc = mergeComponents(
    swaggerDoc,
    loadYamlFile(path.join(componentsDir, "parameters.yaml")),
  );

  fs.readdirSync(schemasDir).forEach((file) => {
    swaggerDoc = mergeComponents(
      swaggerDoc,
      loadYamlFile(path.join(schemasDir, file)),
    );
  });

  fs.readdirSync(modulesDir).forEach((file) => {
    swaggerDoc = deepMerge(
      swaggerDoc,
      loadYamlFile(path.join(modulesDir, file)),
    );
  });

  // logger.info("Merged components keys:");
  // logger.info(Object.keys(swaggerDoc.components));

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

  app.use(
    "/api",
    openApiValidator({
      apiSpec: swaggerDoc,
      validateRequests: true,
      validateResponses: false,
    }),
  );

  logger.info("Swagger ready at /docs");
};
