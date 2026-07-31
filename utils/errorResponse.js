export function getErrorResponse(error, fallbackMessage, fallbackStatus = 500) {
  if (error?.name === "ValidationError") {
    const firstError = Object.values(error.errors ?? {})[0];
    return {
      status: 400,
      message: firstError?.message || fallbackMessage,
    };
  }

  if (error?.code === 11000 || error?.name === "MongoServerError") {
    return {
      status: 409,
      message: "Email already exists",
    };
  }

  return {
    status: fallbackStatus,
    message: fallbackMessage,
  };
}
