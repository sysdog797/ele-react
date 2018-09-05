export const fetchData = () => {
    return fetch('data.json').then(rs => rs.json()).then(datas => {
          return datas
      });
}