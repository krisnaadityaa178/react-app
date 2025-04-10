PGDMP  $                    }            my_todos    17.4    17.4     	           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            
           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false                       1262    16469    my_todos    DATABASE     n   CREATE DATABASE my_todos WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en-US';
    DROP DATABASE my_todos;
                     postgres    false            �            1259    16497    files    TABLE     �   CREATE TABLE public.files (
    id integer NOT NULL,
    todo_id integer,
    file_name text,
    file_url text,
    uploaded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.files;
       public         heap r       postgres    false            �            1259    16496    files_id_seq    SEQUENCE     �   CREATE SEQUENCE public.files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.files_id_seq;
       public               postgres    false    222                       0    0    files_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;
          public               postgres    false    221            �            1259    16471    todos    TABLE     �   CREATE TABLE public.todos (
    id integer NOT NULL,
    text text NOT NULL,
    completed boolean DEFAULT false,
    user_id integer,
    due_date timestamp without time zone,
    file_url text
);
    DROP TABLE public.todos;
       public         heap r       postgres    false            �            1259    16470    todos_id_seq    SEQUENCE     �   CREATE SEQUENCE public.todos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.todos_id_seq;
       public               postgres    false    218                       0    0    todos_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.todos_id_seq OWNED BY public.todos.id;
          public               postgres    false    217            �            1259    16481    users    TABLE     l   CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    16480    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false    220                       0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public               postgres    false    219            d           2604    16500    files id    DEFAULT     d   ALTER TABLE ONLY public.files ALTER COLUMN id SET DEFAULT nextval('public.files_id_seq'::regclass);
 7   ALTER TABLE public.files ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    222    221    222            a           2604    16474    todos id    DEFAULT     d   ALTER TABLE ONLY public.todos ALTER COLUMN id SET DEFAULT nextval('public.todos_id_seq'::regclass);
 7   ALTER TABLE public.todos ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    217    218    218            c           2604    16484    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    220    219    220                      0    16497    files 
   TABLE DATA           N   COPY public.files (id, todo_id, file_name, file_url, uploaded_at) FROM stdin;
    public               postgres    false    222   q                 0    16471    todos 
   TABLE DATA           Q   COPY public.todos (id, text, completed, user_id, due_date, file_url) FROM stdin;
    public               postgres    false    218   �                 0    16481    users 
   TABLE DATA           4   COPY public.users (id, email, password) FROM stdin;
    public               postgres    false    220   �                  0    0    files_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.files_id_seq', 4, true);
          public               postgres    false    221                       0    0    todos_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.todos_id_seq', 27, true);
          public               postgres    false    217                       0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 3, true);
          public               postgres    false    219            m           2606    16505    files files_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.files DROP CONSTRAINT files_pkey;
       public                 postgres    false    222            g           2606    16479    todos todos_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.todos DROP CONSTRAINT todos_pkey;
       public                 postgres    false    218            i           2606    16490    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public                 postgres    false    220            k           2606    16488    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    220            o           2606    16506    files files_todo_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_todo_id_fkey FOREIGN KEY (todo_id) REFERENCES public.todos(id) ON DELETE CASCADE;
 B   ALTER TABLE ONLY public.files DROP CONSTRAINT files_todo_id_fkey;
       public               postgres    false    4711    218    222            n           2606    16491    todos todos_user_id_fkey    FK CONSTRAINT     w   ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 B   ALTER TABLE ONLY public.todos DROP CONSTRAINT todos_user_id_fkey;
       public               postgres    false    218    220    4715               q   x����	�@��N6��7Nf;����Q���o��)�����^������;k]�{�?�s�L��t��p��H ��:���ܫ��1Y��5�n��yh[jZ��4V"��(G         �   x���=�0�g�\ ��C�� �P���}!t )m#{�>[O~�a윃��ي�m�4]G���9dd��IQć�* ��#<t�ʈCU�)naD1òC?���M&�1���D��:�F1«Y�aH����|E�Σk�%'1����2�ln{Ų'is·���mWZ4j#��L)���         �   x�3�L�OJtH�M���K���T1JR14Pq��Ks7/��.,��L�t,IOur7�)�t���3�����Ω(M�6/�(,.*2v�2�f�i\�����s�EYPnDD��q�i``^j�i���EJJTFA�^�~Q����cDT���k�K�W� D�1�     