drop extension if exists "pg_net";


  create table "public"."detalle_pedido" (
    "id" uuid not null default gen_random_uuid(),
    "pedido_id" uuid not null,
    "pastel_id" uuid,
    "cantidad" integer,
    "precio" numeric
      );


alter table "public"."detalle_pedido" enable row level security;


  create table "public"."pagos" (
    "id" uuid not null default gen_random_uuid(),
    "pedido_id" uuid not null,
    "user_id" uuid,
    "total" numeric,
    "estado" text,
    "metodo" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."pagos" enable row level security;


  create table "public"."pasteles" (
    "id" uuid not null default gen_random_uuid(),
    "nombre" text not null,
    "descripcion" text default ''::text,
    "precio" numeric,
    "imagen_url" text default ''::text,
    "activo" boolean
      );


alter table "public"."pasteles" enable row level security;


  create table "public"."pedidos" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "mensaje_personalizado" text,
    "estado" text default 'pendiente'::text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."pedidos" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null,
    "email" text,
    "role" text default 'user'::text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."profiles" enable row level security;

CREATE UNIQUE INDEX detalle_pedido_pkey ON public.detalle_pedido USING btree (id);

CREATE UNIQUE INDEX pagos_pkey ON public.pagos USING btree (id);

CREATE UNIQUE INDEX pasteles_pkey ON public.pasteles USING btree (id);

CREATE UNIQUE INDEX pedidos_pkey ON public.pedidos USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

alter table "public"."detalle_pedido" add constraint "detalle_pedido_pkey" PRIMARY KEY using index "detalle_pedido_pkey";

alter table "public"."pagos" add constraint "pagos_pkey" PRIMARY KEY using index "pagos_pkey";

alter table "public"."pasteles" add constraint "pasteles_pkey" PRIMARY KEY using index "pasteles_pkey";

alter table "public"."pedidos" add constraint "pedidos_pkey" PRIMARY KEY using index "pedidos_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."detalle_pedido" add constraint "detalle_pedido_pastel_id_fkey" FOREIGN KEY (pastel_id) REFERENCES public.pasteles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."detalle_pedido" validate constraint "detalle_pedido_pastel_id_fkey";

alter table "public"."detalle_pedido" add constraint "detalle_pedido_pedido_id_fkey" FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."detalle_pedido" validate constraint "detalle_pedido_pedido_id_fkey";

alter table "public"."pagos" add constraint "pagos_pedido_id_fkey" FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."pagos" validate constraint "pagos_pedido_id_fkey";

alter table "public"."pagos" add constraint "pagos_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."pagos" validate constraint "pagos_user_id_fkey";

alter table "public"."pedidos" add constraint "pedidos_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE not valid;

alter table "public"."pedidos" validate constraint "pedidos_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$function$
;

grant delete on table "public"."detalle_pedido" to "anon";

grant insert on table "public"."detalle_pedido" to "anon";

grant references on table "public"."detalle_pedido" to "anon";

grant select on table "public"."detalle_pedido" to "anon";

grant trigger on table "public"."detalle_pedido" to "anon";

grant truncate on table "public"."detalle_pedido" to "anon";

grant update on table "public"."detalle_pedido" to "anon";

grant delete on table "public"."detalle_pedido" to "authenticated";

grant insert on table "public"."detalle_pedido" to "authenticated";

grant references on table "public"."detalle_pedido" to "authenticated";

grant select on table "public"."detalle_pedido" to "authenticated";

grant trigger on table "public"."detalle_pedido" to "authenticated";

grant truncate on table "public"."detalle_pedido" to "authenticated";

grant update on table "public"."detalle_pedido" to "authenticated";

grant delete on table "public"."detalle_pedido" to "service_role";

grant insert on table "public"."detalle_pedido" to "service_role";

grant references on table "public"."detalle_pedido" to "service_role";

grant select on table "public"."detalle_pedido" to "service_role";

grant trigger on table "public"."detalle_pedido" to "service_role";

grant truncate on table "public"."detalle_pedido" to "service_role";

grant update on table "public"."detalle_pedido" to "service_role";

grant delete on table "public"."pagos" to "anon";

grant insert on table "public"."pagos" to "anon";

grant references on table "public"."pagos" to "anon";

grant select on table "public"."pagos" to "anon";

grant trigger on table "public"."pagos" to "anon";

grant truncate on table "public"."pagos" to "anon";

grant update on table "public"."pagos" to "anon";

grant delete on table "public"."pagos" to "authenticated";

grant insert on table "public"."pagos" to "authenticated";

grant references on table "public"."pagos" to "authenticated";

grant select on table "public"."pagos" to "authenticated";

grant trigger on table "public"."pagos" to "authenticated";

grant truncate on table "public"."pagos" to "authenticated";

grant update on table "public"."pagos" to "authenticated";

grant delete on table "public"."pagos" to "service_role";

grant insert on table "public"."pagos" to "service_role";

grant references on table "public"."pagos" to "service_role";

grant select on table "public"."pagos" to "service_role";

grant trigger on table "public"."pagos" to "service_role";

grant truncate on table "public"."pagos" to "service_role";

grant update on table "public"."pagos" to "service_role";

grant delete on table "public"."pasteles" to "anon";

grant insert on table "public"."pasteles" to "anon";

grant references on table "public"."pasteles" to "anon";

grant select on table "public"."pasteles" to "anon";

grant trigger on table "public"."pasteles" to "anon";

grant truncate on table "public"."pasteles" to "anon";

grant update on table "public"."pasteles" to "anon";

grant delete on table "public"."pasteles" to "authenticated";

grant insert on table "public"."pasteles" to "authenticated";

grant references on table "public"."pasteles" to "authenticated";

grant select on table "public"."pasteles" to "authenticated";

grant trigger on table "public"."pasteles" to "authenticated";

grant truncate on table "public"."pasteles" to "authenticated";

grant update on table "public"."pasteles" to "authenticated";

grant delete on table "public"."pasteles" to "service_role";

grant insert on table "public"."pasteles" to "service_role";

grant references on table "public"."pasteles" to "service_role";

grant select on table "public"."pasteles" to "service_role";

grant trigger on table "public"."pasteles" to "service_role";

grant truncate on table "public"."pasteles" to "service_role";

grant update on table "public"."pasteles" to "service_role";

grant delete on table "public"."pedidos" to "anon";

grant insert on table "public"."pedidos" to "anon";

grant references on table "public"."pedidos" to "anon";

grant select on table "public"."pedidos" to "anon";

grant trigger on table "public"."pedidos" to "anon";

grant truncate on table "public"."pedidos" to "anon";

grant update on table "public"."pedidos" to "anon";

grant delete on table "public"."pedidos" to "authenticated";

grant insert on table "public"."pedidos" to "authenticated";

grant references on table "public"."pedidos" to "authenticated";

grant select on table "public"."pedidos" to "authenticated";

grant trigger on table "public"."pedidos" to "authenticated";

grant truncate on table "public"."pedidos" to "authenticated";

grant update on table "public"."pedidos" to "authenticated";

grant delete on table "public"."pedidos" to "service_role";

grant insert on table "public"."pedidos" to "service_role";

grant references on table "public"."pedidos" to "service_role";

grant select on table "public"."pedidos" to "service_role";

grant trigger on table "public"."pedidos" to "service_role";

grant truncate on table "public"."pedidos" to "service_role";

grant update on table "public"."pedidos" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";


  create policy "lectura publica pasteles"
  on "public"."pasteles"
  as permissive
  for select
  to public
using (true);



  create policy "Allow insert for all"
  on "public"."pedidos"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Allow select for all"
  on "public"."pedidos"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Allow update for all"
  on "public"."pedidos"
  as permissive
  for update
  to authenticated
using ((auth.email() = 'ellyperezvides@gmail.com'::text))
with check ((auth.email() = 'ellyperezvides@gmail.com'::text));



  create policy "Allow update for authenticated users"
  on "public"."pedidos"
  as permissive
  for update
  to authenticated
using ((auth.email() = 'ellyperezvides@gmail.com'::text))
with check ((auth.email() = 'ellyperezvides@gmail.com'::text));



  create policy "Allow users to insert their own orders"
  on "public"."pedidos"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Allow users to read their own orders"
  on "public"."pedidos"
  as permissive
  for select
  to public
using ((auth.email() = 'sgrajalesci27@gmail.com'::text));



  create policy "User can update own pedidos"
  on "public"."pedidos"
  as permissive
  for update
  to authenticated, supabase_admin
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



  create policy "Users can view their own profile"
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using ((auth.uid() = id));


CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


