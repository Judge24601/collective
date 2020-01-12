import Api from "@/services/Api";

export default {
  addCollective(params) {
    return Api().post("collectives", params);
  },
  fetchCollectives() {
    console.log("got here")
    return Api().get("collectives");
  },
};
