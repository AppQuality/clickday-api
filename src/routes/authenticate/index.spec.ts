import app from "@src/app";
import { tryber } from "@src/features/database";
import request from "supertest";
import { HashPassword } from "wordpress-hash-node";
jest.unmock("jsonwebtoken");

describe("Authenticate", () => {
  beforeAll(async () => {
    await tryber.tables.WpUsers.do().insert({
      ID: 1,
      user_login: "admin",
      user_pass: HashPassword("admin"),
    });
    await tryber.tables.WpAppqEvdProfile.do().insert({
      wp_user_id: 1,
      email: "",
      education_id: 0,
      employment_id: 0,
    });
    await tryber.tables.WpOptions.do().insert({
      option_id: 1,
      option_name: "wp_user_roles",
      option_value:
        'a:21:{s:13:"administrator";a:2:{s:4:"name";s:13:"Administrator";s:12:"capabilities";a:194:{s:16:"activate_plugins";b:1;s:9:"add_users";b:1;s:13:"bbp_keymaster";b:1;s:9:"browse-db";b:1;s:17:"community_manager";b:1;s:12:"create_posts";b:1;s:12:"create_users";b:1;s:27:"delete_appq_default_message";b:1;s:28:"delete_appq_default_messages";b:1;s:24:"delete_aq_lesson_content";b:1;s:19:"delete_others_pages";b:1;s:19:"delete_others_posts";b:1;s:12:"delete_pages";b:1;s:14:"delete_plugins";b:1;s:12:"delete_posts";b:1;s:20:"delete_private_pages";b:1;s:20:"delete_private_posts";b:1;s:22:"delete_published_pages";b:1;s:22:"delete_published_posts";b:1;s:24:"delete_tablepress_tables";b:1;s:13:"delete_themes";b:1;s:12:"delete_users";b:1;s:25:"edit_appq_default_message";b:1;s:26:"edit_appq_default_messages";b:1;s:22:"edit_aq_lesson_content";b:1;s:9:"edit_bugs";b:1;s:14:"edit_bugs_data";b:1;s:14:"edit_campaigns";b:1;s:19:"edit_campaigns_data";b:1;s:11:"edit_course";b:1;s:14:"edit_customers";b:1;s:14:"edit_dashboard";b:1;s:12:"edit_devices";b:1;s:10:"edit_files";b:1;s:33:"edit_others_appq_default_messages";b:1;s:29:"edit_others_aq_lesson_content";b:1;s:17:"edit_others_pages";b:1;s:17:"edit_others_posts";b:1;s:29:"edit_others_tablepress_tables";b:1;s:10:"edit_pages";b:1;s:12:"edit_plugins";b:1;s:10:"edit_posts";b:1;s:18:"edit_private_pages";b:1;s:18:"edit_private_posts";b:1;s:20:"edit_published_pages";b:1;s:20:"edit_published_posts";b:1;s:22:"edit_tablepress_tables";b:1;s:12:"edit_testers";b:1;s:18:"edit_theme_options";b:1;s:11:"edit_themes";b:1;s:10:"edit_users";b:1;s:6:"export";b:1;s:27:"export_others_personal_data";b:1;s:6:"import";b:1;s:21:"import_facebook_leads";b:1;s:17:"install_languages";b:1;s:15:"install_plugins";b:1;s:14:"install_themes";b:1;s:7:"level_0";b:1;s:7:"level_1";b:1;s:8:"level_10";b:1;s:7:"level_2";b:1;s:7:"level_3";b:1;s:7:"level_4";b:1;s:7:"level_5";b:1;s:7:"level_6";b:1;s:7:"level_7";b:1;s:7:"level_8";b:1;s:7:"level_9";b:1;s:14:"list_campaigns";b:1;s:10:"list_users";b:1;s:17:"manage_categories";b:1;s:12:"manage_links";b:1;s:14:"manage_options";b:1;s:22:"manage_privacy_options";b:1;s:17:"moderate_comments";b:1;s:11:"pay_testers";b:1;s:13:"promote_users";b:1;s:29:"publish_appq_default_messages";b:1;s:25:"publish_aq_lesson_content";b:1;s:13:"publish_pages";b:1;s:13:"publish_posts";b:1;s:25:"publish_tablepress_tables";b:1;s:14:"quality_leader";b:1;s:4:"read";b:1;s:25:"read_appq_default_message";b:1;s:22:"read_aq_lesson_content";b:1;s:9:"read_bugs";b:1;s:14:"read_campaigns";b:1;s:12:"read_devices";b:1;s:34:"read_private_appq_default_messages";b:1;s:30:"read_private_aq_lesson_content";b:1;s:18:"read_private_pages";b:1;s:18:"read_private_posts";b:1;s:30:"read_private_tablepress_tables";b:1;s:12:"remove_users";b:1;s:14:"resume_plugins";b:1;s:13:"resume_themes";b:1;s:14:"select_testers";b:1;s:13:"switch_themes";b:1;s:30:"tablepress_access_about_screen";b:1;s:32:"tablepress_access_options_screen";b:1;s:21:"tablepress_add_tables";b:1;s:22:"tablepress_copy_tables";b:1;s:24:"tablepress_delete_tables";b:1;s:23:"tablepress_edit_options";b:1;s:22:"tablepress_edit_tables";b:1;s:24:"tablepress_export_tables";b:1;s:24:"tablepress_import_tables";b:1;s:22:"tablepress_list_tables";b:1;s:15:"unfiltered_html";b:1;s:17:"unfiltered_upload";b:1;s:11:"update_core";b:1;s:14:"update_plugins";b:1;s:13:"update_themes";b:1;s:12:"upload_files";b:1;s:23:"ure_create_capabilities";b:1;s:16:"ure_create_roles";b:1;s:23:"ure_delete_capabilities";b:1;s:16:"ure_delete_roles";b:1;s:14:"ure_edit_roles";b:1;s:18:"ure_manage_options";b:1;s:15:"ure_reset_roles";b:1;s:18:"use_message_center";b:1;s:23:"view_site_health_checks";b:1;s:19:"wp_admin_visibility";b:1;s:15:"wpseo_bulk_edit";b:1;s:28:"wpseo_edit_advanced_metadata";b:1;s:20:"wpseo_manage_options";b:1;s:31:"vc_access_rules_post_types/post";b:1;s:31:"vc_access_rules_post_types/page";b:1;s:26:"vc_access_rules_post_types";s:6:"custom";s:30:"vc_access_rules_backend_editor";b:1;s:29:"vc_access_rules_post_settings";b:1;s:24:"vc_access_rules_settings";b:1;s:25:"vc_access_rules_templates";b:1;s:26:"vc_access_rules_shortcodes";b:1;s:28:"vc_access_rules_grid_builder";b:1;s:23:"vc_access_rules_presets";b:1;s:25:"vc_access_rules_dragndrop";b:1;s:37:"vc_access_rules_post_types/mvc_lesson";b:1;s:20:"appq_bug_full_access";b:1;s:35:"appq_campaign_dashboard_full_access";b:1;s:25:"appq_campaign_full_access";b:1;s:23:"appq_course_full_access";b:1;s:23:"appq_manual_full_access";b:1;s:24:"appq_preview_full_access";b:1;s:25:"appq_prospect_full_access";b:1;s:31:"appq_task_dashboard_full_access";b:1;s:21:"appq_task_full_access";b:1;s:33:"appq_tester_selection_full_access";b:1;s:27:"appq_mail_merge_full_access";b:1;s:32:"appq_video_dashboard_full_access";b:1;s:12:"edit_preview";b:1;s:13:"edit_previews";b:1;s:19:"edit_other_previews";b:1;s:16:"publish_previews";b:1;s:12:"read_preview";b:1;s:21:"read_private_previews";b:1;s:11:"edit_manual";b:1;s:12:"edit_manuals";b:1;s:18:"edit_other_manuals";b:1;s:15:"publish_manuals";b:1;s:11:"read_manual";b:1;s:20:"read_private_manuals";b:1;s:18:"manage_permissions";b:1;s:19:"admin_menu_appq_bug";b:1;s:34:"admin_menu_appq_campaign_dashboard";b:1;s:24:"admin_menu_appq_campaign";b:1;s:33:"admin_menu_appq_custom_user_field";b:1;s:22:"admin_menu_appq_course";b:1;s:26:"admin_menu_appq_mail_merge";b:1;s:22:"admin_menu_appq_manual";b:1;s:24:"admin_menu_appq_prospect";b:1;s:30:"admin_menu_appq_task_dashboard";b:1;s:20:"admin_menu_appq_task";b:1;s:32:"admin_menu_appq_tester_selection";b:1;s:31:"admin_menu_appq_video_dashboard";b:1;s:23:"admin_menu_appq_preview";b:1;s:24:"appq_profile_full_access";b:1;s:34:"appq_custom_user_field_full_access";b:1;s:32:"campaign_object_level_permission";b:1;s:33:"vc_access_rules_post_types/manual";b:1;s:34:"vc_access_rules_post_types/preview";b:1;s:34:"appq_campaign_category_full_access";b:1;s:30:"appq_quality_badge_full_access";b:1;s:31:"appq_fiscal_profile_full_access";b:1;s:31:"appq_message_center_full_access";b:1;s:32:"appq_email_templates_full_access";b:1;s:30:"appq_simple_editor_full_access";b:1;s:31:"appq_token_handling_full_access";b:1;s:47:"vc_access_rules_post_types/appq_default_message";b:1;s:31:"vc_access_rules_unfiltered_html";b:1;s:25:"manage_preselection_forms";b:1;}}s:6:"editor";a:2:{s:4:"name";s:6:"Editor";s:12:"capabilities";a:59:{s:17:"moderate_comments";b:1;s:17:"manage_categories";b:1;s:12:"manage_links";b:1;s:12:"upload_files";b:1;s:15:"unfiltered_html";b:1;s:10:"edit_posts";b:1;s:17:"edit_others_posts";b:1;s:20:"edit_published_posts";b:1;s:13:"publish_posts";b:1;s:10:"edit_pages";b:1;s:4:"read";b:1;s:7:"level_7";b:1;s:7:"level_6";b:1;s:7:"level_5";b:1;s:7:"level_4";b:1;s:7:"level_3";b:1;s:7:"level_2";b:1;s:7:"level_1";b:1;s:7:"level_0";b:1;s:17:"edit_others_pages";b:1;s:20:"edit_published_pages";b:1;s:13:"publish_pages";b:1;s:12:"delete_pages";b:1;s:19:"delete_others_pages";b:1;s:22:"delete_published_pages";b:1;s:12:"delete_posts";b:1;s:19:"delete_others_posts";b:1;s:22:"delete_published_posts";b:1;s:20:"delete_private_posts";b:1;s:18:"edit_private_posts";b:1;s:18:"read_private_posts";b:1;s:20:"delete_private_pages";b:1;s:18:"edit_private_pages";b:1;s:18:"read_private_pages";b:1;s:26:"vc_access_rules_post_types";s:6:"custom";s:30:"vc_access_rules_backend_editor";b:1;s:29:"vc_access_rules_post_settings";b:1;s:25:"vc_access_rules_templates";b:1;s:26:"vc_access_rules_shortcodes";b:1;s:28:"vc_access_rules_grid_builder";b:1;s:23:"vc_access_rules_presets";b:1;s:25:"vc_access_rules_dragndrop";b:1;s:15:"wpseo_bulk_edit";b:1;s:22:"tablepress_edit_tables";b:1;s:24:"tablepress_delete_tables";b:1;s:22:"tablepress_list_tables";b:1;s:21:"tablepress_add_tables";b:1;s:22:"tablepress_copy_tables";b:1;s:24:"tablepress_import_tables";b:1;s:24:"tablepress_export_tables";b:1;s:32:"tablepress_access_options_screen";b:1;s:30:"tablepress_access_about_screen";b:1;s:31:"vc_access_rules_post_types/post";b:1;s:31:"vc_access_rules_post_types/page";b:1;s:33:"vc_access_rules_post_types/manual";b:1;s:34:"vc_access_rules_post_types/preview";b:1;s:37:"vc_access_rules_post_types/mvc_lesson";b:1;s:47:"vc_access_rules_post_types/appq_default_message";b:1;s:31:"vc_access_rules_unfiltered_html";b:1;}}s:11:"contributor";a:2:{s:4:"name";s:8:"Customer";s:12:"capabilities";a:14:{s:10:"edit_posts";b:1;s:4:"read";b:1;s:7:"level_1";b:1;s:7:"level_0";b:1;s:12:"delete_posts";b:1;s:26:"vc_access_rules_post_types";b:0;s:30:"vc_access_rules_backend_editor";b:1;s:29:"vc_access_rules_post_settings";b:1;s:25:"vc_access_rules_templates";b:1;s:26:"vc_access_rules_shortcodes";b:1;s:28:"vc_access_rules_grid_builder";b:1;s:23:"vc_access_rules_presets";b:1;s:25:"vc_access_rules_dragndrop";b:1;s:31:"vc_access_rules_unfiltered_html";b:0;}}s:13:"wpseo_manager";a:2:{s:4:"name";s:11:"SEO Manager";s:12:"capabilities";a:47:{s:17:"moderate_comments";b:1;s:17:"manage_categories";b:1;s:12:"manage_links";b:1;s:12:"upload_files";b:1;s:15:"unfiltered_html";b:1;s:10:"edit_posts";b:1;s:17:"edit_others_posts";b:1;s:20:"edit_published_posts";b:1;s:13:"publish_posts";b:1;s:10:"edit_pages";b:1;s:4:"read";b:1;s:7:"level_7";b:1;s:7:"level_6";b:1;s:7:"level_5";b:1;s:7:"level_4";b:1;s:7:"level_3";b:1;s:7:"level_2";b:1;s:7:"level_1";b:1;s:7:"level_0";b:1;s:17:"edit_others_pages";b:1;s:20:"edit_published_pages";b:1;s:13:"publish_pages";b:1;s:12:"delete_pages";b:1;s:19:"delete_others_pages";b:1;s:22:"delete_published_pages";b:1;s:12:"delete_posts";b:1;s:19:"delete_others_posts";b:1;s:22:"delete_published_posts";b:1;s:20:"delete_private_posts";b:1;s:18:"edit_private_posts";b:1;s:18:"read_private_posts";b:1;s:20:"delete_private_pages";b:1;s:18:"edit_private_pages";b:1;s:18:"read_private_pages";b:1;s:26:"vc_access_rules_post_types";s:6:"custom";s:30:"vc_access_rules_backend_editor";b:1;s:29:"vc_access_rules_post_settings";b:1;s:25:"vc_access_rules_templates";b:1;s:26:"vc_access_rules_shortcodes";b:1;s:28:"vc_access_rules_grid_builder";b:1;s:23:"vc_access_rules_presets";b:1;s:25:"vc_access_rules_dragndrop";b:1;s:15:"wpseo_bulk_edit";b:1;s:28:"wpseo_edit_advanced_metadata";b:1;s:20:"wpseo_manage_options";b:1;s:23:"view_site_health_checks";b:1;s:31:"vc_access_rules_unfiltered_html";b:1;}}s:12:"wpseo_editor";a:2:{s:4:"name";s:10:"SEO Editor";s:12:"capabilities";a:45:{s:17:"moderate_comments";b:1;s:17:"manage_categories";b:1;s:12:"manage_links";b:1;s:12:"upload_files";b:1;s:15:"unfiltered_html";b:1;s:10:"edit_posts";b:1;s:17:"edit_others_posts";b:1;s:20:"edit_published_posts";b:1;s:13:"publish_posts";b:1;s:10:"edit_pages";b:1;s:4:"read";b:1;s:7:"level_7";b:1;s:7:"level_6";b:1;s:7:"level_5";b:1;s:7:"level_4";b:1;s:7:"level_3";b:1;s:7:"level_2";b:1;s:7:"level_1";b:1;s:7:"level_0";b:1;s:17:"edit_others_pages";b:1;s:20:"edit_published_pages";b:1;s:13:"publish_pages";b:1;s:12:"delete_pages";b:1;s:19:"delete_others_pages";b:1;s:22:"delete_published_pages";b:1;s:12:"delete_posts";b:1;s:19:"delete_others_posts";b:1;s:22:"delete_published_posts";b:1;s:20:"delete_private_posts";b:1;s:18:"edit_private_posts";b:1;s:18:"read_private_posts";b:1;s:20:"delete_private_pages";b:1;s:18:"edit_private_pages";b:1;s:18:"read_private_pages";b:1;s:26:"vc_access_rules_post_types";s:6:"custom";s:30:"vc_access_rules_backend_editor";b:1;s:29:"vc_access_rules_post_settings";b:1;s:25:"vc_access_rules_templates";b:1;s:26:"vc_access_rules_shortcodes";b:1;s:28:"vc_access_rules_grid_builder";b:1;s:23:"vc_access_rules_presets";b:1;s:25:"vc_access_rules_dragndrop";b:1;s:15:"wpseo_bulk_edit";b:1;s:28:"wpseo_edit_advanced_metadata";b:1;s:31:"vc_access_rules_unfiltered_html";b:1;}}s:8:"supplier";a:2:{s:4:"name";s:8:"Supplier";s:12:"capabilities";a:5:{s:4:"read";b:1;s:9:"edit_bugs";b:1;s:19:"wp_admin_visibility";b:1;s:7:"level_1";b:1;s:18:"use_message_center";b:1;}}s:19:"tester_super_writer";a:2:{s:4:"name";s:19:"Tester Super Writer";s:12:"capabilities";a:45:{s:4:"read";b:1;s:12:"edit_preview";b:1;s:13:"edit_previews";b:1;s:19:"edit_other_previews";b:1;s:16:"publish_previews";b:1;s:12:"read_preview";b:1;s:21:"read_private_previews";b:1;s:11:"edit_manual";b:1;s:12:"edit_manuals";b:1;s:18:"edit_other_manuals";b:1;s:15:"publish_manuals";b:1;s:11:"read_manual";b:1;s:20:"read_private_manuals";b:1;s:10:"edit_posts";b:1;s:20:"edit_published_posts";b:1;s:17:"edit_others_posts";b:1;s:13:"publish_posts";b:1;s:12:"delete_posts";b:1;s:10:"edit_pages";b:1;s:17:"edit_others_pages";b:1;s:13:"publish_pages";b:1;s:20:"edit_published_pages";b:1;s:18:"read_private_posts";b:1;s:18:"read_private_pages";b:1;s:18:"edit_private_posts";b:1;s:18:"edit_private_pages";b:1;s:12:"upload_files";b:1;s:19:"wp_admin_visibility";b:1;s:18:"use_message_center";b:1;s:7:"level_2";b:1;s:31:"vc_access_rules_post_types/post";b:1;s:31:"vc_access_rules_post_types/page";b:1;s:33:"vc_access_rules_post_types/manual";b:1;s:34:"vc_access_rules_post_types/preview";b:1;s:37:"vc_access_rules_post_types/mvc_lesson";b:1;s:26:"vc_access_rules_post_types";s:6:"custom";s:30:"vc_access_rules_backend_editor";b:1;s:29:"vc_access_rules_post_settings";b:1;s:25:"vc_access_rules_templates";b:1;s:26:"vc_access_rules_shortcodes";b:1;s:28:"vc_access_rules_grid_builder";b:1;s:23:"vc_access_rules_presets";b:1;s:25:"vc_access_rules_dragndrop";b:1;s:47:"vc_access_rules_post_types/appq_default_message";b:1;s:31:"vc_access_rules_unfiltered_html";b:0;}}s:14:"quality_leader";a:2:{s:4:"name";s:14:"Quality Leader";s:12:"capabilities";a:102:{s:4:"read";b:1;s:20:"appq_bug_full_access";b:1;s:35:"appq_campaign_dashboard_full_access";b:1;s:25:"appq_campaign_full_access";b:1;s:23:"appq_course_full_access";b:1;s:27:"appq_mail_merge_full_access";b:1;s:23:"appq_manual_full_access";b:1;s:24:"appq_preview_full_access";b:1;s:25:"appq_prospect_full_access";b:1;s:31:"appq_task_dashboard_full_access";b:1;s:21:"appq_task_full_access";b:1;s:33:"appq_tester_selection_full_access";b:1;s:24:"appq_profile_full_access";b:1;s:34:"appq_custom_user_field_full_access";b:1;s:34:"appq_campaign_category_full_access";b:1;s:32:"appq_video_dashboard_full_access";b:1;s:31:"appq_fiscal_profile_full_access";b:1;s:31:"appq_message_center_full_access";b:1;s:30:"appq_quality_badge_full_access";b:1;s:32:"appq_email_templates_full_access";b:1;s:31:"appq_token_handling_full_access";b:1;s:30:"appq_simple_editor_full_access";b:1;s:19:"admin_menu_appq_bug";b:1;s:34:"admin_menu_appq_campaign_dashboard";b:1;s:24:"admin_menu_appq_campaign";b:1;s:22:"admin_menu_appq_course";b:1;s:26:"admin_menu_appq_mail_merge";b:1;s:22:"admin_menu_appq_manual";b:1;s:23:"admin_menu_appq_preview";b:1;s:24:"admin_menu_appq_prospect";b:1;s:30:"admin_menu_appq_task_dashboard";b:1;s:20:"admin_menu_appq_task";b:1;s:32:"admin_menu_appq_tester_selection";b:1;s:31:"admin_menu_appq_video_dashboard";b:1;s:33:"admin_menu_appq_custom_user_field";b:1;s:12:"edit_preview";b:1;s:13:"edit_previews";b:1;s:19:"edit_other_previews";b:1;s:16:"publish_previews";b:1;s:12:"read_preview";b:1;s:21:"read_private_previews";b:1;s:11:"edit_manual";b:1;s:12:"edit_manuals";b:1;s:18:"edit_other_manuals";b:1;s:15:"publish_manuals";b:1;s:11:"read_manual";b:1;s:20:"read_private_manuals";b:1;s:11:"edit_course";b:1;s:22:"edit_aq_lesson_content";b:1;s:22:"read_aq_lesson_content";b:1;s:24:"delete_aq_lesson_content";b:1;s:29:"edit_others_aq_lesson_content";b:1;s:25:"publish_aq_lesson_content";b:1;s:30:"read_private_aq_lesson_content";b:1;s:10:"edit_posts";b:1;s:20:"edit_published_posts";b:1;s:17:"edit_others_posts";b:1;s:13:"publish_posts";b:1;s:12:"delete_posts";b:1;s:10:"edit_pages";b:1;s:17:"edit_others_pages";b:1;s:13:"publish_pages";b:1;s:20:"edit_published_pages";b:1;s:18:"read_private_posts";b:1;s:18:"read_private_pages";b:1;s:18:"edit_private_posts";b:1;s:18:"edit_private_pages";b:1;s:25:"edit_appq_default_message";b:1;s:25:"read_appq_default_message";b:1;s:28:"delete_appq_default_messages";b:1;s:27:"delete_appq_default_message";b:1;s:26:"edit_appq_default_messages";b:1;s:33:"edit_others_appq_default_messages";b:1;s:29:"publish_appq_default_messages";b:1;s:34:"read_private_appq_default_messages";b:1;s:9:"add_users";b:1;s:12:"create_users";b:1;s:13:"promote_users";b:1;s:10:"list_users";b:1;s:12:"delete_users";b:1;s:10:"edit_users";b:1;s:12:"edit_testers";b:1;s:14:"select_testers";b:1;s:14:"edit_bugs_data";b:1;s:9:"read_bugs";b:1;s:9:"edit_bugs";b:1;s:14:"list_campaigns";b:1;s:14:"edit_customers";b:1;s:14:"edit_campaigns";b:1;s:19:"edit_campaigns_data";b:1;s:14:"read_campaigns";b:1;s:12:"edit_devices";b:1;s:12:"read_devices";b:1;s:25:"manage_preselection_forms";b:1;s:11:"pay_testers";b:1;s:9:"browse-db";b:1;s:21:"import_facebook_leads";b:1;s:12:"upload_files";b:1;s:18:"use_message_center";b:1;s:19:"wp_admin_visibility";b:1;s:18:"manage_permissions";b:1;s:7:"level_9";b:1;}}s:17:"community_manager";a:2:{s:4:"name";s:17:"Community Manager";s:12:"capabilities";a:67:{s:4:"read";b:1;s:12:"edit_preview";b:1;s:13:"edit_previews";b:1;s:19:"edit_other_previews";b:1;s:16:"publish_previews";b:1;s:12:"read_preview";b:1;s:21:"read_private_previews";b:1;s:19:"admin_menu_appq_bug";b:1;s:34:"admin_menu_appq_campaign_dashboard";b:1;s:24:"admin_menu_appq_campaign";b:1;s:22:"admin_menu_appq_course";b:1;s:26:"admin_menu_appq_mail_merge";b:1;s:22:"admin_menu_appq_manual";b:1;s:23:"admin_menu_appq_preview";b:1;s:24:"admin_menu_appq_prospect";b:1;s:30:"admin_menu_appq_task_dashboard";b:1;s:20:"admin_menu_appq_task";b:1;s:32:"admin_menu_appq_tester_selection";b:1;s:31:"admin_menu_appq_video_dashboard";b:1;s:33:"admin_menu_appq_custom_user_field";b:1;s:11:"edit_manual";b:1;s:12:"edit_manuals";b:1;s:18:"edit_other_manuals";b:1;s:15:"publish_manuals";b:1;s:11:"read_manual";b:1;s:20:"read_private_manuals";b:1;s:27:"export_others_personal_data";b:1;s:22:"manage_privacy_options";b:1;s:14:"manage_options";b:1;s:11:"edit_course";b:1;s:22:"edit_aq_lesson_content";b:1;s:22:"read_aq_lesson_content";b:1;s:24:"delete_aq_lesson_content";b:1;s:29:"edit_others_aq_lesson_content";b:1;s:25:"publish_aq_lesson_content";b:1;s:30:"read_private_aq_lesson_content";b:1;s:10:"edit_posts";b:1;s:20:"edit_published_posts";b:1;s:17:"edit_others_posts";b:1;s:13:"publish_posts";b:1;s:12:"delete_posts";b:1;s:10:"edit_pages";b:1;s:17:"edit_others_pages";b:1;s:13:"publish_pages";b:1;s:20:"edit_published_pages";b:1;s:18:"read_private_posts";b:1;s:18:"read_private_pages";b:1;s:18:"edit_private_posts";b:1;s:18:"edit_private_pages";b:1;s:9:"add_users";b:1;s:12:"create_users";b:1;s:13:"promote_users";b:1;s:10:"list_users";b:1;s:12:"delete_users";b:1;s:10:"edit_users";b:1;s:12:"edit_testers";b:1;s:14:"select_testers";b:1;s:9:"browse-db";b:1;s:14:"read_campaigns";b:1;s:21:"import_facebook_leads";b:1;s:12:"upload_files";b:1;s:18:"use_message_center";b:1;s:19:"wp_admin_visibility";b:1;s:18:"manage_permissions";b:1;s:33:"appq_tester_selection_full_access";b:1;s:32:"appq_email_templates_full_access";b:1;s:7:"level_8";b:1;}}s:11:"tester_lead";a:2:{s:4:"name";s:13:"Tester Leader";s:12:"capabilities";a:34:{s:4:"read";b:1;s:12:"edit_preview";b:1;s:13:"edit_previews";b:1;s:19:"edit_other_previews";b:1;s:16:"publish_previews";b:1;s:12:"read_preview";b:1;s:21:"read_private_previews";b:1;s:11:"edit_manual";b:1;s:12:"edit_manuals";b:1;s:18:"edit_other_manuals";b:1;s:15:"publish_manuals";b:1;s:11:"read_manual";b:1;s:20:"read_private_manuals";b:1;s:19:"admin_menu_appq_bug";b:1;s:34:"admin_menu_appq_campaign_dashboard";b:1;s:24:"admin_menu_appq_campaign";b:1;s:22:"admin_menu_appq_course";b:1;s:26:"admin_menu_appq_mail_merge";b:1;s:22:"admin_menu_appq_manual";b:1;s:23:"admin_menu_appq_preview";b:1;s:24:"admin_menu_appq_prospect";b:1;s:30:"admin_menu_appq_task_dashboard";b:1;s:20:"admin_menu_appq_task";b:1;s:32:"admin_menu_appq_tester_selection";b:1;s:31:"admin_menu_appq_video_dashboard";b:1;s:33:"admin_menu_appq_custom_user_field";b:1;s:25:"manage_preselection_forms";b:1;s:9:"edit_bugs";b:1;s:18:"use_message_center";b:1;s:19:"wp_admin_visibility";b:1;s:32:"campaign_object_level_permission";b:1;s:31:"appq_message_center_full_access";b:1;s:32:"appq_email_templates_full_access";b:1;s:7:"level_2";b:1;}}s:12:"tester_coach";a:2:{s:4:"name";s:12:"Tester Coach";s:12:"capabilities";a:40:{s:4:"read";b:1;s:12:"edit_preview";b:1;s:13:"edit_previews";b:1;s:19:"edit_other_previews";b:1;s:16:"publish_previews";b:1;s:12:"read_preview";b:1;s:21:"read_private_previews";b:1;s:11:"edit_manual";b:1;s:12:"edit_manuals";b:1;s:18:"edit_other_manuals";b:1;s:15:"publish_manuals";b:1;s:11:"read_manual";b:1;s:20:"read_private_manuals";b:1;s:10:"edit_posts";b:1;s:20:"edit_published_posts";b:1;s:17:"edit_others_posts";b:1;s:13:"publish_posts";b:1;s:12:"delete_posts";b:1;s:10:"edit_pages";b:1;s:17:"edit_others_pages";b:1;s:13:"publish_pages";b:1;s:20:"edit_published_pages";b:1;s:18:"read_private_posts";b:1;s:18:"read_private_pages";b:1;s:18:"edit_private_posts";b:1;s:18:"edit_private_pages";b:1;s:11:"edit_course";b:1;s:22:"edit_aq_lesson_content";b:1;s:22:"read_aq_lesson_content";b:1;s:24:"delete_aq_lesson_content";b:1;s:29:"edit_others_aq_lesson_content";b:1;s:25:"publish_aq_lesson_content";b:1;s:30:"read_private_aq_lesson_content";b:1;s:14:"list_campaigns";b:1;s:12:"upload_files";b:1;s:19:"wp_admin_visibility";b:1;s:32:"campaign_object_level_permission";b:1;s:32:"appq_email_templates_full_access";b:1;s:31:"appq_message_center_full_access";b:1;s:7:"level_2";b:1;}}s:13:"ux_researcher";a:2:{s:4:"name";s:13:"UX Researcher";s:12:"capabilities";a:17:{s:4:"read";b:1;s:12:"edit_preview";b:1;s:13:"edit_previews";b:1;s:19:"edit_other_previews";b:1;s:16:"publish_previews";b:1;s:12:"read_preview";b:1;s:21:"read_private_previews";b:1;s:11:"edit_manual";b:1;s:12:"edit_manuals";b:1;s:18:"edit_other_manuals";b:1;s:15:"publish_manuals";b:1;s:11:"read_manual";b:1;s:20:"read_private_manuals";b:1;s:9:"edit_bugs";b:1;s:19:"wp_admin_visibility";b:1;s:32:"campaign_object_level_permission";b:1;s:7:"level_2";b:1;}}s:16:"tester_recruiter";a:2:{s:4:"name";s:16:"Tester Recruiter";s:12:"capabilities";a:18:{s:4:"read";b:1;s:12:"edit_preview";b:1;s:13:"edit_previews";b:1;s:19:"edit_other_previews";b:1;s:16:"publish_previews";b:1;s:12:"read_preview";b:1;s:21:"read_private_previews";b:1;s:11:"edit_manual";b:1;s:12:"edit_manuals";b:1;s:18:"edit_other_manuals";b:1;s:15:"publish_manuals";b:1;s:11:"read_manual";b:1;s:20:"read_private_manuals";b:1;s:18:"use_message_center";b:1;s:19:"wp_admin_visibility";b:1;s:32:"appq_email_templates_full_access";b:1;s:31:"appq_message_center_full_access";b:1;s:7:"level_2";b:1;}}s:16:"tester_assistant";a:2:{s:4:"name";s:16:"Tester Assistant";s:12:"capabilities";a:18:{s:4:"read";b:1;s:12:"edit_preview";b:1;s:13:"edit_previews";b:1;s:19:"edit_other_previews";b:1;s:16:"publish_previews";b:1;s:12:"read_preview";b:1;s:21:"read_private_previews";b:1;s:11:"edit_manual";b:1;s:12:"edit_manuals";b:1;s:18:"edit_other_manuals";b:1;s:15:"publish_manuals";b:1;s:11:"read_manual";b:1;s:20:"read_private_manuals";b:1;s:18:"use_message_center";b:1;s:19:"wp_admin_visibility";b:1;s:32:"appq_email_templates_full_access";b:1;s:31:"appq_message_center_full_access";b:1;s:7:"level_2";b:1;}}s:7:"finance";a:2:{s:4:"name";s:7:"Finance";s:12:"capabilities";a:55:{s:4:"read";b:1;s:19:"admin_menu_appq_bug";b:1;s:34:"admin_menu_appq_campaign_dashboard";b:1;s:24:"admin_menu_appq_campaign";b:1;s:22:"admin_menu_appq_course";b:1;s:26:"admin_menu_appq_mail_merge";b:1;s:22:"admin_menu_appq_manual";b:1;s:23:"admin_menu_appq_preview";b:1;s:24:"admin_menu_appq_prospect";b:1;s:30:"admin_menu_appq_task_dashboard";b:1;s:20:"admin_menu_appq_task";b:1;s:32:"admin_menu_appq_tester_selection";b:1;s:31:"admin_menu_appq_video_dashboard";b:1;s:33:"admin_menu_appq_custom_user_field";b:1;s:12:"edit_preview";b:1;s:13:"edit_previews";b:1;s:19:"edit_other_previews";b:1;s:16:"publish_previews";b:1;s:12:"read_preview";b:1;s:21:"read_private_previews";b:1;s:11:"edit_manual";b:1;s:12:"edit_manuals";b:1;s:18:"edit_other_manuals";b:1;s:15:"publish_manuals";b:1;s:11:"read_manual";b:1;s:20:"read_private_manuals";b:1;s:14:"list_campaigns";b:1;s:14:"edit_customers";b:1;s:14:"edit_campaigns";b:1;s:19:"edit_campaigns_data";b:1;s:14:"read_campaigns";b:1;s:12:"edit_devices";b:1;s:12:"read_devices";b:1;s:10:"edit_posts";b:1;s:20:"edit_published_posts";b:1;s:17:"edit_others_posts";b:1;s:13:"publish_posts";b:1;s:12:"delete_posts";b:1;s:10:"edit_pages";b:1;s:17:"edit_others_pages";b:1;s:13:"publish_pages";b:1;s:20:"edit_published_pages";b:1;s:18:"read_private_posts";b:1;s:18:"read_private_pages";b:1;s:18:"edit_private_posts";b:1;s:18:"edit_private_pages";b:1;s:18:"use_message_center";b:1;s:21:"import_facebook_leads";b:1;s:19:"wp_admin_visibility";b:1;s:18:"manage_permissions";b:1;s:11:"pay_testers";b:1;s:25:"appq_prospect_full_access";b:1;s:32:"appq_email_templates_full_access";b:1;s:31:"appq_message_center_full_access";b:1;s:7:"level_9";b:1;}}s:10:"subscriber";a:2:{s:4:"name";s:6:"Tester";s:12:"capabilities";a:14:{s:4:"read";b:1;s:12:"edit_preview";b:1;s:13:"edit_previews";b:1;s:19:"edit_other_previews";b:1;s:16:"publish_previews";b:1;s:12:"read_preview";b:1;s:21:"read_private_previews";b:1;s:11:"edit_manual";b:1;s:12:"edit_manuals";b:1;s:18:"edit_other_manuals";b:1;s:15:"publish_manuals";b:1;s:11:"read_manual";b:1;s:20:"read_private_manuals";b:1;s:7:"level_0";b:1;}}s:22:"email_templates_editor";a:2:{s:4:"name";s:20:"EmaiTemplates Editor";s:12:"capabilities";a:3:{s:4:"read";b:1;s:32:"appq_email_templates_full_access";b:1;s:8:"level_10";b:1;}}s:9:"testAdmin";a:2:{s:4:"name";s:15:"Admin Role Test";s:12:"capabilities";a:18:{s:4:"read";b:1;s:19:"admin_menu_appq_bug";b:1;s:34:"admin_menu_appq_campaign_dashboard";b:1;s:24:"admin_menu_appq_campaign";b:1;s:22:"admin_menu_appq_course";b:1;s:26:"admin_menu_appq_mail_merge";b:1;s:22:"admin_menu_appq_manual";b:1;s:23:"admin_menu_appq_preview";b:1;s:24:"admin_menu_appq_prospect";b:1;s:30:"admin_menu_appq_task_dashboard";b:1;s:20:"admin_menu_appq_task";b:1;s:32:"admin_menu_appq_tester_selection";b:1;s:31:"admin_menu_appq_video_dashboard";b:1;s:33:"admin_menu_appq_custom_user_field";b:1;s:19:"wp_admin_visibility";b:1;s:32:"appq_email_templates_full_access";b:1;s:31:"appq_message_center_full_access";b:1;s:7:"level_2";b:1;}}s:6:"author";a:2:{s:4:"name";s:8:"Customer";s:12:"capabilities";a:14:{s:4:"read";b:1;s:12:"edit_preview";b:1;s:13:"edit_previews";b:1;s:19:"edit_other_previews";b:1;s:16:"publish_previews";b:1;s:12:"read_preview";b:1;s:21:"read_private_previews";b:1;s:11:"edit_manual";b:1;s:12:"edit_manuals";b:1;s:18:"edit_other_manuals";b:1;s:15:"publish_manuals";b:1;s:11:"read_manual";b:1;s:20:"read_private_manuals";b:1;s:7:"level_0";b:1;}}s:13:"tester_writer";a:2:{s:4:"name";s:13:"Tester Writer";s:12:"capabilities";a:19:{s:4:"read";b:1;s:10:"edit_posts";b:1;s:20:"edit_published_posts";b:1;s:17:"edit_others_posts";b:1;s:13:"publish_posts";b:1;s:12:"delete_posts";b:1;s:10:"edit_pages";b:1;s:17:"edit_others_pages";b:1;s:13:"publish_pages";b:1;s:20:"edit_published_pages";b:1;s:18:"read_private_posts";b:1;s:18:"read_private_pages";b:1;s:18:"edit_private_posts";b:1;s:18:"edit_private_pages";b:1;s:12:"upload_files";b:1;s:19:"wp_admin_visibility";b:1;s:32:"appq_email_templates_full_access";b:1;s:31:"appq_message_center_full_access";b:1;s:7:"level_2";b:1;}}s:22:"tester_super_assistant";a:2:{s:4:"name";s:22:"Tester Super Assistant";s:12:"capabilities";a:32:{s:4:"read";b:1;s:12:"edit_preview";b:1;s:13:"edit_previews";b:1;s:19:"edit_other_previews";b:1;s:16:"publish_previews";b:1;s:12:"read_preview";b:1;s:21:"read_private_previews";b:1;s:11:"edit_manual";b:1;s:12:"edit_manuals";b:1;s:18:"edit_other_manuals";b:1;s:15:"publish_manuals";b:1;s:11:"read_manual";b:1;s:20:"read_private_manuals";b:1;s:10:"edit_posts";b:1;s:20:"edit_published_posts";b:1;s:17:"edit_others_posts";b:1;s:13:"publish_posts";b:1;s:12:"delete_posts";b:1;s:10:"edit_pages";b:1;s:17:"edit_others_pages";b:1;s:13:"publish_pages";b:1;s:20:"edit_published_pages";b:1;s:18:"read_private_posts";b:1;s:18:"read_private_pages";b:1;s:18:"edit_private_posts";b:1;s:18:"edit_private_pages";b:1;s:12:"upload_files";b:1;s:19:"wp_admin_visibility";b:1;s:18:"use_message_center";b:1;s:32:"appq_email_templates_full_access";b:1;s:31:"appq_message_center_full_access";b:1;s:7:"level_2";b:1;}}}',
      autoload: "yes",
    });
  });

  it("should return 200 when password is correct", async () => {
    const response = await request(app).post("/authenticate").send({
      username: "admin",
      password: "admin",
    });
    expect(response.status).toBe(200);
  });

  it("should return 401 when password is not correct", async () => {
    const response = await request(app).post("/authenticate").send({
      username: "admin",
      password: "wrong",
    });
    expect(response.status).toBe(401);
  });
  it("should test test", async () => {
    expect(1).toBe(1);
  });
});
