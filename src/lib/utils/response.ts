import { NextResponse } from "next/server";

export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = { success: false; error: { code: string; message: string } };
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export const ErrorCode = {
  AUTH_REQUIRED: "AUTH_REQUIRED",
  AUTH_FORBIDDEN: "AUTH_FORBIDDEN",
  VALIDATION_FAILED: "VALIDATION_FAILED",
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
  QUOTA_EXHAUSTED: "QUOTA_EXHAUSTED",
  AI_SERVICE_ERROR: "AI_SERVICE_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
} as const;

export function ok<T>(data: T, status = 200) {
  return NextResponse.json<ApiSuccess<T>>({ success: true, data }, { status });
}

export function fail(code: string, message: string, status = 400) {
  return NextResponse.json<ApiError>(
    { success: false, error: { code, message } },
    { status }
  );
}

export const unauthorized = (msg = "请先登录") =>
  fail(ErrorCode.AUTH_REQUIRED, msg, 401);

export const forbidden = (msg = "无访问权限") =>
  fail(ErrorCode.AUTH_FORBIDDEN, msg, 403);

export const notFound = (msg = "资源不存在") =>
  fail(ErrorCode.RESOURCE_NOT_FOUND, msg, 404);

export const serverError = (msg = "服务器内部错误") =>
  fail(ErrorCode.SERVER_ERROR, msg, 500);

export const quotaExhausted = (msg = "AI 对话次数已用完，请充值升级") =>
  fail(ErrorCode.QUOTA_EXHAUSTED, msg, 402);
