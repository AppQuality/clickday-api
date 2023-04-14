import { tryber } from "@src/features/database";

export default async (userName: string) => {
  const results = await tryber.tables.WpUsers.do()
    .select(
      tryber.ref("id").withSchema("wp_appq_evd_profile").as("testerId"),
      tryber.ref("ID").withSchema("wp_users"),
      "user_login",
      "user_pass"
    )
    .join(
      "wp_appq_evd_profile",
      "wp_users.ID",
      "wp_appq_evd_profile.wp_user_id"
    )
    .where("user_login", userName)
    .first();
  if (!results) {
    return Error("No user with name " + userName);
  }
  return {
    ...results,
    ID: results.ID.toString(),
  };
};
