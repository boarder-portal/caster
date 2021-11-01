export async function live(request: Request): Promise<Response> {
  return fetch(`http://localhost:5391/live/${request.urlMatch.streamPath}.flv`);
}
