import Api from "@/services/Api";

export default {
  addCollective(params) {
    return Api().post("collectives", params);
  },
};
