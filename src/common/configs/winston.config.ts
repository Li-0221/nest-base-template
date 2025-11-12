import { utilities as nestWinstonModuleUtilities, WinstonModuleOptions } from "nest-winston";
import * as winston from "winston";
import "winston-daily-rotate-file";

const trans = winston.transports;

const customFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, context, stack }) => {
    const contextStr = context ? `[${context}]` : "";
    const stackStr = stack ? `\n${stack}` : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${contextStr} ${message}${stackStr}`;
  })
);

const httpFilter = winston.format(info => {
  return info.context === "HTTP" ? info : false;
});

const nonHttpFilter = winston.format(info => {
  return info.context !== "HTTP" ? info : false;
});

export const winstonConfig: WinstonModuleOptions = {
  transports: [
    // --- 控制台输出 ---
    new trans.Console({
      format: winston.format.combine(
        nonHttpFilter(),
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike("Nest", {
          prettyPrint: true,
          colors: true
        })
      )
    }),

    // --- 1. 错误日志 (error.log) ---
    new trans.DailyRotateFile({
      level: "error",
      dirname: "logs",
      filename: "%DATE%-error.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "10m",
      maxFiles: "30d",
      zippedArchive: true,
      format: winston.format.combine(nonHttpFilter(), customFormat)
    }),

    // --- 2. 请求日志 (request.log) ---
    new trans.DailyRotateFile({
      level: "info",
      dirname: "logs",
      filename: "%DATE%-request.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "10m",
      maxFiles: "30d",
      zippedArchive: true,
      format: winston.format.combine(httpFilter(), customFormat)
    })
  ]
};
