export default {

  dl(data) {
    return Array.isArray(data) ? data : [data];
  },

  sro(data) {
    return data.toUpperCase();
  },

};
