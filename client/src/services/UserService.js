import Api from "@/services/Api";

export default {
  addUser(params) {
    return Api().post("user", params);
  }
};
