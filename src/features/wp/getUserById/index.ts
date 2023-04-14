import { tryber } from "@src/features/database";

export default async (userId: number) => {
  const results = await tryber.tables.WpUsers.do()
    .select(
      tryber.ref("id").withSchema("wp_appq_evd_profile").as("testerId"),
      "ID",
      "user_login",
      "user_pass"
    )
    .join(
      "wp_appq_evd_profile",
      "wp_users.ID",
      "wp_appq_evd_profile.wp_user_id"
    )
    .where("ID", userId)
    .first();
  if (!results) {
    return Error("No user with id " + userId);
  }
  return {
    ...results,
    ID: results.ID.toString(),
  };
};
