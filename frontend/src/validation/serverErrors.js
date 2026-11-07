export function serverErrorsToFields(apiError) {
  const fields = {};

  for (const issue of apiError.errors || []) {
    fields[issue.field] = issue.message;
  }

  return fields;
}
