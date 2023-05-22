export function getCurrentDate(separator=''){
  let newDate = new Date().toLocaleString({month: "long"}) + "";

  return `${newDate}`
}