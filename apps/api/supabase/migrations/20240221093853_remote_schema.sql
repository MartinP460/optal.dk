create table "public"."_prisma_migrations" (
    "id" character varying(36) not null,
    "checksum" character varying(64) not null,
    "finished_at" timestamp with time zone,
    "migration_name" character varying(255) not null,
    "logs" text,
    "rolled_back_at" timestamp with time zone,
    "started_at" timestamp with time zone not null default now(),
    "applied_steps_count" integer not null default 0
);


create table "public"."event_data" (
    "event_data_id" uuid not null,
    "website_id" uuid not null,
    "website_event_id" uuid not null,
    "event_key" character varying(500) not null,
    "string_value" character varying(500),
    "number_value" numeric(19,4),
    "date_value" timestamp(6) with time zone,
    "data_type" integer not null,
    "created_at" timestamp(6) with time zone default CURRENT_TIMESTAMP
);


create table "public"."report" (
    "report_id" uuid not null,
    "user_id" uuid not null,
    "website_id" uuid not null,
    "type" character varying(200) not null,
    "name" character varying(200) not null,
    "description" character varying(500) not null,
    "parameters" character varying(6000) not null,
    "created_at" timestamp(6) with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp(6) with time zone
);


create table "public"."session" (
    "session_id" uuid not null,
    "website_id" uuid not null,
    "hostname" character varying(100),
    "browser" character varying(20),
    "os" character varying(20),
    "device" character varying(20),
    "screen" character varying(11),
    "language" character varying(35),
    "country" character(2),
    "subdivision1" character varying(20),
    "subdivision2" character varying(50),
    "city" character varying(50),
    "created_at" timestamp(6) with time zone default CURRENT_TIMESTAMP
);


create table "public"."session_data" (
    "session_data_id" uuid not null,
    "website_id" uuid not null,
    "session_id" uuid not null,
    "session_key" character varying(500) not null,
    "string_value" character varying(500),
    "number_value" numeric(19,4),
    "date_value" timestamp(6) with time zone,
    "data_type" integer not null,
    "created_at" timestamp(6) with time zone default CURRENT_TIMESTAMP,
    "deleted_at" timestamp(6) with time zone default CURRENT_TIMESTAMP
);


create table "public"."team" (
    "team_id" uuid not null,
    "name" character varying(50) not null,
    "access_code" character varying(50),
    "created_at" timestamp(6) with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp(6) with time zone
);


create table "public"."team_user" (
    "team_user_id" uuid not null,
    "team_id" uuid not null,
    "user_id" uuid not null,
    "role" character varying(50) not null,
    "created_at" timestamp(6) with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp(6) with time zone
);


create table "public"."team_website" (
    "team_website_id" uuid not null,
    "team_id" uuid not null,
    "website_id" uuid not null,
    "created_at" timestamp(6) with time zone default CURRENT_TIMESTAMP
);


create table "public"."user" (
    "user_id" uuid not null,
    "username" character varying(255) not null,
    "password" character varying(60) not null,
    "role" character varying(50) not null,
    "created_at" timestamp(6) with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp(6) with time zone,
    "deleted_at" timestamp(6) with time zone
);


create table "public"."website" (
    "website_id" uuid not null,
    "name" character varying(100) not null,
    "domain" character varying(500),
    "share_id" character varying(50),
    "reset_at" timestamp(6) with time zone,
    "user_id" uuid,
    "created_at" timestamp(6) with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp(6) with time zone,
    "deleted_at" timestamp(6) with time zone
);


create table "public"."website_event" (
    "event_id" uuid not null,
    "website_id" uuid not null,
    "session_id" uuid not null,
    "created_at" timestamp(6) with time zone default CURRENT_TIMESTAMP,
    "url_path" character varying(500) not null,
    "url_query" character varying(500),
    "referrer_path" character varying(500),
    "referrer_query" character varying(500),
    "referrer_domain" character varying(500),
    "page_title" character varying(500),
    "event_type" integer not null default 1,
    "event_name" character varying(50)
);


CREATE UNIQUE INDEX _prisma_migrations_pkey ON public._prisma_migrations USING btree (id);

CREATE INDEX event_data_created_at_idx ON public.event_data USING btree (created_at);

CREATE UNIQUE INDEX event_data_pkey ON public.event_data USING btree (event_data_id);

CREATE INDEX event_data_website_event_id_idx ON public.event_data USING btree (website_event_id);

CREATE INDEX event_data_website_id_created_at_event_key_idx ON public.event_data USING btree (website_id, created_at, event_key);

CREATE INDEX event_data_website_id_created_at_idx ON public.event_data USING btree (website_id, created_at);

CREATE INDEX event_data_website_id_idx ON public.event_data USING btree (website_id);

CREATE INDEX report_name_idx ON public.report USING btree (name);

CREATE UNIQUE INDEX report_pkey ON public.report USING btree (report_id);

CREATE UNIQUE INDEX report_report_id_key ON public.report USING btree (report_id);

CREATE INDEX report_type_idx ON public.report USING btree (type);

CREATE INDEX report_user_id_idx ON public.report USING btree (user_id);

CREATE INDEX report_website_id_idx ON public.report USING btree (website_id);

CREATE INDEX session_created_at_idx ON public.session USING btree (created_at);

CREATE INDEX session_data_created_at_idx ON public.session_data USING btree (created_at);

CREATE UNIQUE INDEX session_data_pkey ON public.session_data USING btree (session_data_id);

CREATE INDEX session_data_session_id_idx ON public.session_data USING btree (session_id);

CREATE INDEX session_data_website_id_idx ON public.session_data USING btree (website_id);

CREATE UNIQUE INDEX session_pkey ON public.session USING btree (session_id);

CREATE UNIQUE INDEX session_session_id_key ON public.session USING btree (session_id);

CREATE INDEX session_website_id_created_at_browser_idx ON public.session USING btree (website_id, created_at, browser);

CREATE INDEX session_website_id_created_at_city_idx ON public.session USING btree (website_id, created_at, city);

CREATE INDEX session_website_id_created_at_country_idx ON public.session USING btree (website_id, created_at, country);

CREATE INDEX session_website_id_created_at_device_idx ON public.session USING btree (website_id, created_at, device);

CREATE INDEX session_website_id_created_at_hostname_idx ON public.session USING btree (website_id, created_at, hostname);

CREATE INDEX session_website_id_created_at_idx ON public.session USING btree (website_id, created_at);

CREATE INDEX session_website_id_created_at_language_idx ON public.session USING btree (website_id, created_at, language);

CREATE INDEX session_website_id_created_at_os_idx ON public.session USING btree (website_id, created_at, os);

CREATE INDEX session_website_id_created_at_screen_idx ON public.session USING btree (website_id, created_at, screen);

CREATE INDEX session_website_id_created_at_subdivision1_idx ON public.session USING btree (website_id, created_at, subdivision1);

CREATE INDEX session_website_id_idx ON public.session USING btree (website_id);

CREATE INDEX team_access_code_idx ON public.team USING btree (access_code);

CREATE UNIQUE INDEX team_access_code_key ON public.team USING btree (access_code);

CREATE UNIQUE INDEX team_pkey ON public.team USING btree (team_id);

CREATE UNIQUE INDEX team_team_id_key ON public.team USING btree (team_id);

CREATE UNIQUE INDEX team_user_pkey ON public.team_user USING btree (team_user_id);

CREATE INDEX team_user_team_id_idx ON public.team_user USING btree (team_id);

CREATE UNIQUE INDEX team_user_team_user_id_key ON public.team_user USING btree (team_user_id);

CREATE INDEX team_user_user_id_idx ON public.team_user USING btree (user_id);

CREATE UNIQUE INDEX team_website_pkey ON public.team_website USING btree (team_website_id);

CREATE INDEX team_website_team_id_idx ON public.team_website USING btree (team_id);

CREATE UNIQUE INDEX team_website_team_website_id_key ON public.team_website USING btree (team_website_id);

CREATE INDEX team_website_website_id_idx ON public.team_website USING btree (website_id);

CREATE UNIQUE INDEX user_pkey ON public."user" USING btree (user_id);

CREATE UNIQUE INDEX user_user_id_key ON public."user" USING btree (user_id);

CREATE UNIQUE INDEX user_username_key ON public."user" USING btree (username);

CREATE INDEX website_created_at_idx ON public.website USING btree (created_at);

CREATE INDEX website_event_created_at_idx ON public.website_event USING btree (created_at);

CREATE UNIQUE INDEX website_event_pkey ON public.website_event USING btree (event_id);

CREATE INDEX website_event_session_id_idx ON public.website_event USING btree (session_id);

CREATE INDEX website_event_website_id_created_at_event_name_idx ON public.website_event USING btree (website_id, created_at, event_name);

CREATE INDEX website_event_website_id_created_at_idx ON public.website_event USING btree (website_id, created_at);

CREATE INDEX website_event_website_id_created_at_page_title_idx ON public.website_event USING btree (website_id, created_at, page_title);

CREATE INDEX website_event_website_id_created_at_referrer_domain_idx ON public.website_event USING btree (website_id, created_at, referrer_domain);

CREATE INDEX website_event_website_id_created_at_url_path_idx ON public.website_event USING btree (website_id, created_at, url_path);

CREATE INDEX website_event_website_id_created_at_url_query_idx ON public.website_event USING btree (website_id, created_at, url_query);

CREATE INDEX website_event_website_id_idx ON public.website_event USING btree (website_id);

CREATE INDEX website_event_website_id_session_id_created_at_idx ON public.website_event USING btree (website_id, session_id, created_at);

CREATE UNIQUE INDEX website_pkey ON public.website USING btree (website_id);

CREATE INDEX website_share_id_idx ON public.website USING btree (share_id);

CREATE UNIQUE INDEX website_share_id_key ON public.website USING btree (share_id);

CREATE INDEX website_user_id_idx ON public.website USING btree (user_id);

CREATE UNIQUE INDEX website_website_id_key ON public.website USING btree (website_id);

alter table "public"."_prisma_migrations" add constraint "_prisma_migrations_pkey" PRIMARY KEY using index "_prisma_migrations_pkey";

alter table "public"."event_data" add constraint "event_data_pkey" PRIMARY KEY using index "event_data_pkey";

alter table "public"."report" add constraint "report_pkey" PRIMARY KEY using index "report_pkey";

alter table "public"."session" add constraint "session_pkey" PRIMARY KEY using index "session_pkey";

alter table "public"."session_data" add constraint "session_data_pkey" PRIMARY KEY using index "session_data_pkey";

alter table "public"."team" add constraint "team_pkey" PRIMARY KEY using index "team_pkey";

alter table "public"."team_user" add constraint "team_user_pkey" PRIMARY KEY using index "team_user_pkey";

alter table "public"."team_website" add constraint "team_website_pkey" PRIMARY KEY using index "team_website_pkey";

alter table "public"."user" add constraint "user_pkey" PRIMARY KEY using index "user_pkey";

alter table "public"."website" add constraint "website_pkey" PRIMARY KEY using index "website_pkey";

alter table "public"."website_event" add constraint "website_event_pkey" PRIMARY KEY using index "website_event_pkey";

grant delete on table "public"."_prisma_migrations" to "anon";

grant insert on table "public"."_prisma_migrations" to "anon";

grant references on table "public"."_prisma_migrations" to "anon";

grant select on table "public"."_prisma_migrations" to "anon";

grant trigger on table "public"."_prisma_migrations" to "anon";

grant truncate on table "public"."_prisma_migrations" to "anon";

grant update on table "public"."_prisma_migrations" to "anon";

grant delete on table "public"."_prisma_migrations" to "authenticated";

grant insert on table "public"."_prisma_migrations" to "authenticated";

grant references on table "public"."_prisma_migrations" to "authenticated";

grant select on table "public"."_prisma_migrations" to "authenticated";

grant trigger on table "public"."_prisma_migrations" to "authenticated";

grant truncate on table "public"."_prisma_migrations" to "authenticated";

grant update on table "public"."_prisma_migrations" to "authenticated";

grant delete on table "public"."_prisma_migrations" to "service_role";

grant insert on table "public"."_prisma_migrations" to "service_role";

grant references on table "public"."_prisma_migrations" to "service_role";

grant select on table "public"."_prisma_migrations" to "service_role";

grant trigger on table "public"."_prisma_migrations" to "service_role";

grant truncate on table "public"."_prisma_migrations" to "service_role";

grant update on table "public"."_prisma_migrations" to "service_role";

grant delete on table "public"."event_data" to "anon";

grant insert on table "public"."event_data" to "anon";

grant references on table "public"."event_data" to "anon";

grant select on table "public"."event_data" to "anon";

grant trigger on table "public"."event_data" to "anon";

grant truncate on table "public"."event_data" to "anon";

grant update on table "public"."event_data" to "anon";

grant delete on table "public"."event_data" to "authenticated";

grant insert on table "public"."event_data" to "authenticated";

grant references on table "public"."event_data" to "authenticated";

grant select on table "public"."event_data" to "authenticated";

grant trigger on table "public"."event_data" to "authenticated";

grant truncate on table "public"."event_data" to "authenticated";

grant update on table "public"."event_data" to "authenticated";

grant delete on table "public"."event_data" to "service_role";

grant insert on table "public"."event_data" to "service_role";

grant references on table "public"."event_data" to "service_role";

grant select on table "public"."event_data" to "service_role";

grant trigger on table "public"."event_data" to "service_role";

grant truncate on table "public"."event_data" to "service_role";

grant update on table "public"."event_data" to "service_role";

grant delete on table "public"."report" to "anon";

grant insert on table "public"."report" to "anon";

grant references on table "public"."report" to "anon";

grant select on table "public"."report" to "anon";

grant trigger on table "public"."report" to "anon";

grant truncate on table "public"."report" to "anon";

grant update on table "public"."report" to "anon";

grant delete on table "public"."report" to "authenticated";

grant insert on table "public"."report" to "authenticated";

grant references on table "public"."report" to "authenticated";

grant select on table "public"."report" to "authenticated";

grant trigger on table "public"."report" to "authenticated";

grant truncate on table "public"."report" to "authenticated";

grant update on table "public"."report" to "authenticated";

grant delete on table "public"."report" to "service_role";

grant insert on table "public"."report" to "service_role";

grant references on table "public"."report" to "service_role";

grant select on table "public"."report" to "service_role";

grant trigger on table "public"."report" to "service_role";

grant truncate on table "public"."report" to "service_role";

grant update on table "public"."report" to "service_role";

grant delete on table "public"."session" to "anon";

grant insert on table "public"."session" to "anon";

grant references on table "public"."session" to "anon";

grant select on table "public"."session" to "anon";

grant trigger on table "public"."session" to "anon";

grant truncate on table "public"."session" to "anon";

grant update on table "public"."session" to "anon";

grant delete on table "public"."session" to "authenticated";

grant insert on table "public"."session" to "authenticated";

grant references on table "public"."session" to "authenticated";

grant select on table "public"."session" to "authenticated";

grant trigger on table "public"."session" to "authenticated";

grant truncate on table "public"."session" to "authenticated";

grant update on table "public"."session" to "authenticated";

grant delete on table "public"."session" to "service_role";

grant insert on table "public"."session" to "service_role";

grant references on table "public"."session" to "service_role";

grant select on table "public"."session" to "service_role";

grant trigger on table "public"."session" to "service_role";

grant truncate on table "public"."session" to "service_role";

grant update on table "public"."session" to "service_role";

grant delete on table "public"."session_data" to "anon";

grant insert on table "public"."session_data" to "anon";

grant references on table "public"."session_data" to "anon";

grant select on table "public"."session_data" to "anon";

grant trigger on table "public"."session_data" to "anon";

grant truncate on table "public"."session_data" to "anon";

grant update on table "public"."session_data" to "anon";

grant delete on table "public"."session_data" to "authenticated";

grant insert on table "public"."session_data" to "authenticated";

grant references on table "public"."session_data" to "authenticated";

grant select on table "public"."session_data" to "authenticated";

grant trigger on table "public"."session_data" to "authenticated";

grant truncate on table "public"."session_data" to "authenticated";

grant update on table "public"."session_data" to "authenticated";

grant delete on table "public"."session_data" to "service_role";

grant insert on table "public"."session_data" to "service_role";

grant references on table "public"."session_data" to "service_role";

grant select on table "public"."session_data" to "service_role";

grant trigger on table "public"."session_data" to "service_role";

grant truncate on table "public"."session_data" to "service_role";

grant update on table "public"."session_data" to "service_role";

grant delete on table "public"."team" to "anon";

grant insert on table "public"."team" to "anon";

grant references on table "public"."team" to "anon";

grant select on table "public"."team" to "anon";

grant trigger on table "public"."team" to "anon";

grant truncate on table "public"."team" to "anon";

grant update on table "public"."team" to "anon";

grant delete on table "public"."team" to "authenticated";

grant insert on table "public"."team" to "authenticated";

grant references on table "public"."team" to "authenticated";

grant select on table "public"."team" to "authenticated";

grant trigger on table "public"."team" to "authenticated";

grant truncate on table "public"."team" to "authenticated";

grant update on table "public"."team" to "authenticated";

grant delete on table "public"."team" to "service_role";

grant insert on table "public"."team" to "service_role";

grant references on table "public"."team" to "service_role";

grant select on table "public"."team" to "service_role";

grant trigger on table "public"."team" to "service_role";

grant truncate on table "public"."team" to "service_role";

grant update on table "public"."team" to "service_role";

grant delete on table "public"."team_user" to "anon";

grant insert on table "public"."team_user" to "anon";

grant references on table "public"."team_user" to "anon";

grant select on table "public"."team_user" to "anon";

grant trigger on table "public"."team_user" to "anon";

grant truncate on table "public"."team_user" to "anon";

grant update on table "public"."team_user" to "anon";

grant delete on table "public"."team_user" to "authenticated";

grant insert on table "public"."team_user" to "authenticated";

grant references on table "public"."team_user" to "authenticated";

grant select on table "public"."team_user" to "authenticated";

grant trigger on table "public"."team_user" to "authenticated";

grant truncate on table "public"."team_user" to "authenticated";

grant update on table "public"."team_user" to "authenticated";

grant delete on table "public"."team_user" to "service_role";

grant insert on table "public"."team_user" to "service_role";

grant references on table "public"."team_user" to "service_role";

grant select on table "public"."team_user" to "service_role";

grant trigger on table "public"."team_user" to "service_role";

grant truncate on table "public"."team_user" to "service_role";

grant update on table "public"."team_user" to "service_role";

grant delete on table "public"."team_website" to "anon";

grant insert on table "public"."team_website" to "anon";

grant references on table "public"."team_website" to "anon";

grant select on table "public"."team_website" to "anon";

grant trigger on table "public"."team_website" to "anon";

grant truncate on table "public"."team_website" to "anon";

grant update on table "public"."team_website" to "anon";

grant delete on table "public"."team_website" to "authenticated";

grant insert on table "public"."team_website" to "authenticated";

grant references on table "public"."team_website" to "authenticated";

grant select on table "public"."team_website" to "authenticated";

grant trigger on table "public"."team_website" to "authenticated";

grant truncate on table "public"."team_website" to "authenticated";

grant update on table "public"."team_website" to "authenticated";

grant delete on table "public"."team_website" to "service_role";

grant insert on table "public"."team_website" to "service_role";

grant references on table "public"."team_website" to "service_role";

grant select on table "public"."team_website" to "service_role";

grant trigger on table "public"."team_website" to "service_role";

grant truncate on table "public"."team_website" to "service_role";

grant update on table "public"."team_website" to "service_role";

grant delete on table "public"."user" to "anon";

grant insert on table "public"."user" to "anon";

grant references on table "public"."user" to "anon";

grant select on table "public"."user" to "anon";

grant trigger on table "public"."user" to "anon";

grant truncate on table "public"."user" to "anon";

grant update on table "public"."user" to "anon";

grant delete on table "public"."user" to "authenticated";

grant insert on table "public"."user" to "authenticated";

grant references on table "public"."user" to "authenticated";

grant select on table "public"."user" to "authenticated";

grant trigger on table "public"."user" to "authenticated";

grant truncate on table "public"."user" to "authenticated";

grant update on table "public"."user" to "authenticated";

grant delete on table "public"."user" to "service_role";

grant insert on table "public"."user" to "service_role";

grant references on table "public"."user" to "service_role";

grant select on table "public"."user" to "service_role";

grant trigger on table "public"."user" to "service_role";

grant truncate on table "public"."user" to "service_role";

grant update on table "public"."user" to "service_role";

grant delete on table "public"."website" to "anon";

grant insert on table "public"."website" to "anon";

grant references on table "public"."website" to "anon";

grant select on table "public"."website" to "anon";

grant trigger on table "public"."website" to "anon";

grant truncate on table "public"."website" to "anon";

grant update on table "public"."website" to "anon";

grant delete on table "public"."website" to "authenticated";

grant insert on table "public"."website" to "authenticated";

grant references on table "public"."website" to "authenticated";

grant select on table "public"."website" to "authenticated";

grant trigger on table "public"."website" to "authenticated";

grant truncate on table "public"."website" to "authenticated";

grant update on table "public"."website" to "authenticated";

grant delete on table "public"."website" to "service_role";

grant insert on table "public"."website" to "service_role";

grant references on table "public"."website" to "service_role";

grant select on table "public"."website" to "service_role";

grant trigger on table "public"."website" to "service_role";

grant truncate on table "public"."website" to "service_role";

grant update on table "public"."website" to "service_role";

grant delete on table "public"."website_event" to "anon";

grant insert on table "public"."website_event" to "anon";

grant references on table "public"."website_event" to "anon";

grant select on table "public"."website_event" to "anon";

grant trigger on table "public"."website_event" to "anon";

grant truncate on table "public"."website_event" to "anon";

grant update on table "public"."website_event" to "anon";

grant delete on table "public"."website_event" to "authenticated";

grant insert on table "public"."website_event" to "authenticated";

grant references on table "public"."website_event" to "authenticated";

grant select on table "public"."website_event" to "authenticated";

grant trigger on table "public"."website_event" to "authenticated";

grant truncate on table "public"."website_event" to "authenticated";

grant update on table "public"."website_event" to "authenticated";

grant delete on table "public"."website_event" to "service_role";

grant insert on table "public"."website_event" to "service_role";

grant references on table "public"."website_event" to "service_role";

grant select on table "public"."website_event" to "service_role";

grant trigger on table "public"."website_event" to "service_role";

grant truncate on table "public"."website_event" to "service_role";

grant update on table "public"."website_event" to "service_role";


