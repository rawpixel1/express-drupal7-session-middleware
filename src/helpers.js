export function executeQuery(db, query, args = []) {
  return new Promise(resolve => {
    db.query(query, args, (error, results) => {
      if (error) {
        console.log(error);
        resolve(false);
        return;
      }
      resolve(results);
    });
  });
}

export default {
  executeQuery
};
