--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Postgres.app)
-- Dumped by pg_dump version 16.4 (Postgres.app)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: rishimaheshwari; Type: DATABASE; Schema: -; Owner: rishimaheshwari
--

CREATE DATABASE rishimaheshwari WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';


ALTER DATABASE rishimaheshwari OWNER TO rishimaheshwari;

\connect rishimaheshwari

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: room_id_base_to_duplicates_count; Type: TABLE; Schema: public; Owner: rishimaheshwari
--

CREATE TABLE public.room_id_base_to_duplicates_count (
    room_id_base character varying(255),
    duplicate_count integer NOT NULL
);


ALTER TABLE public.room_id_base_to_duplicates_count OWNER TO rishimaheshwari;

--
-- Name: rooms; Type: TABLE; Schema: public; Owner: rishimaheshwari
--

CREATE TABLE public.rooms (
    room_id character varying(255) NOT NULL
);


ALTER TABLE public.rooms OWNER TO rishimaheshwari;

--
-- Name: session; Type: TABLE; Schema: public; Owner: rishimaheshwari
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO rishimaheshwari;

--
-- Name: sockets_to_rooms; Type: TABLE; Schema: public; Owner: rishimaheshwari
--

CREATE TABLE public.sockets_to_rooms (
    socket_id character varying(255),
    room_id character varying(255)
);


ALTER TABLE public.sockets_to_rooms OWNER TO rishimaheshwari;

--
-- Name: sockets_to_sessions; Type: TABLE; Schema: public; Owner: rishimaheshwari
--

CREATE TABLE public.sockets_to_sessions (
    socket_id character varying(255) NOT NULL,
    session_id character varying(255)
);


ALTER TABLE public.sockets_to_sessions OWNER TO rishimaheshwari;

--
-- Data for Name: room_id_base_to_duplicates_count; Type: TABLE DATA; Schema: public; Owner: rishimaheshwari
--

COPY public.room_id_base_to_duplicates_count (room_id_base, duplicate_count) FROM stdin;
Darkie	0
asdfewd	0
Jarvis	0
Fargie	0
Skar	0
kwoa	0
Shark	0
Fartie	0
Farties	0
Sharpie	3
NewRoomTest	2
MyPotatoHead	1
Chapati	0
Farjinksi	0
MyNewRoomHAHAHA	0
\.


--
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: rishimaheshwari
--

COPY public.rooms (room_id) FROM stdin;
Darkie
asdfewd
Jarvis
Fargie
Skar
kwoa
Shark
Sharpie
Fartie
Farties
Sharpie1
Sharpie2
Sharpie3
NewRoomTest
NewRoomTest1
NewRoomTest2
MyPotatoHead
MyPotatoHead1
Chapati
Farjinksi
MyNewRoomHAHAHA
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: rishimaheshwari
--

COPY public.session (sid, sess, expire) FROM stdin;
SommChHfvDhxr9IyS7w4WWUiGy9aCaPU	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-02T02:22:54.734Z","httpOnly":true,"path":"/"}}	2024-10-01 19:22:55
Kir2EPKv9LF7lHipk5JTbFWywXbp1ejy	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-02T03:43:33.744Z","httpOnly":true,"path":"/"},"userName":"Biden"}	2024-10-01 20:58:58
I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-02T02:22:57.021Z","httpOnly":true,"path":"/"},"userName":"Rishi"}	2024-10-01 20:58:58
\.


--
-- Data for Name: sockets_to_rooms; Type: TABLE DATA; Schema: public; Owner: rishimaheshwari
--

COPY public.sockets_to_rooms (socket_id, room_id) FROM stdin;
fp3BQlFptngHEasrAAAD	Darkie
VUSzdA8raB0YRaZZAAAJ	Darkie
iiIG-A2nkX3Y0RpmAAAL	Darkie
YwggL4j0GxC_8uK9AAAR	Darkie
lwFvsHqfpFIlHGHSAAAX	Darkie
OrJ7BTQa4QxcqropAAAb	Darkie
V-9sZj-om0vSiKNVAAAf	Darkie
L8PPNj-tJG5AkZHYAAAh	Darkie
SmpDz9Espsw2FPseAAAl	Darkie
ZhTdKpEWTr8i6CdJAAAn	Darkie
bWY8-2LNLUhCji8yAAAr	Darkie
W0chEBgizgyxEw7hAAAx	Darkie
EjcNJpL9UIJOm53_AAA7	Darkie
vsyKPnOzH1-xNns6AAA9	Darkie
zWqYOYEj3WcLXxYPAABB	Darkie
VXFXjlX8-Wkm0BwwAABD	Darkie
KM9d0u_PBxvCEZf9AABJ	Darkie
42jvu3IvNTFb194AAABL	Darkie
g15XbMMrlPMluDtWAABR	Darkie
q_g14oBy4bDjhNyoAABT	Darkie
saPt8TsuEbCBoS7iAABX	Darkie
IR_bCtT16l9TPfpyAABb	Darkie
VDPwhwt4I9vda1LtAABj	Darkie
ngNJZiD8y0PKV1p5AABr	Darkie
wtE0N5NSTDqXZTaLAABv	Darkie
cWQeJDJdgHbPxpJ5AAB3	Darkie
v8WpWWgUBebr95OiAAB9	Darkie
nR4mtNT0uQ2mbX2SAACD	Darkie
dU_TMjkKMGCOupnOAACF	Darkie
gpHNEjq2nhxpSxDvAACL	Darkie
Yi-icyrinxLCl-m6AACN	Darkie
EfRrzPOlbqgbxvPsAACV	Darkie
Brc2770DLKv9UVKaAACd	Darkie
IzckWDID8IMebk-9AACh	Darkie
iGGm62Vekc1ug4qAAACj	Darkie
BUgwmN0tw5TBynPSAACn	Darkie
45mdf4LdUnfTFCoiAAAH	Darkie
AZttF1GrpYxEC-8uAAAJ	Darkie
XOB74z_xfrMiqdymAAAL	Darkie
kCNJ4YVI0NQYPz3mAAAN	Darkie
pOppsCYMSSJlXzs2AAAV	Darkie
JfDdgQ-uMyd5EnXaAAAb	Darkie
S33mrF6pb4OdRIoVAAAf	Darkie
BCqGl6T_VZxStFT_AAAH	Darkie
tHq04_q29LThAqZ1AAAP	Darkie
WjNsHFRnu7sn_2WbAAAV	Darkie
RC0SuLqsF70F4wzwAAAZ	Darkie
e2e_2Z9FoseelDwqAAAd	Darkie
pRu4yPieEOV7rQscAAAj	Darkie
OUGgujOtzSX6SS_kAAAp	Darkie
8-JCQRgoIzm_F9gqAAAt	Darkie
yJ-VEnaCIYEzDFvZAAA5	Darkie
SodxV2NhtNjiTj5-AAA_	Darkie
LMmhRpYBMPBki8XtAABF	Darkie
t8jhMJ0bZM65G2SFAABH	Darkie
SzMX1rsn1fSCl57BAABN	Darkie
b7Z-tGUzqzok7NbnAABV	Darkie
jhKd9U5OsWSXwKCsAABZ	Darkie
fmQxXs-45jUrFk_BAABd	Darkie
j69F_x2GnPI_YvphAABf	Darkie
F-eklDV-eD4aRoE1AABh	Darkie
GWq0PLA-GPQScxOHAABl	Darkie
R3Q-Br2-OkFxGNLXAABn	Darkie
v8G_ESZ6E23wyinnAABp	Darkie
7S2j1FBiBL2tJvkDAABt	Darkie
7r2_-U_wqA5Qu1hQAABx	Darkie
hnzvTm1yBHkZXK_3AAB5	Darkie
bA6q0rUqZO1s-PJ1AAB_	Darkie
-0zM7tNtfGJTM4SRAACB	Darkie
26cEnQmBYAg3YIsgAACJ	Darkie
C0SlBcvnRKTX1YaTAACT	Darkie
GDdB2CR-QmtwG_xyAACX	Darkie
OtBGvJo1YhhWzxwoAACZ	Darkie
mAAQqOemGhNCWu1lAACb	Darkie
Gf3pw8xq91MTJN5YAACf	Darkie
glLjZ2e4HytzjAYdAACl	Darkie
cLQV5PE63FeqehhdAACp	Darkie
9wNkVbZh7P8n4XGJAAAP	Darkie
f32xOLCzYTeXw9MNAAAR	Darkie
7mYsWjIgVdeutXMXAAAZ	Darkie
dJTNU2Zu2ktvQ83AAAAB	Darkie
J-b79QbGNtjuIRlMAAAd	Darkie
\.


--
-- Data for Name: sockets_to_sessions; Type: TABLE DATA; Schema: public; Owner: rishimaheshwari
--

COPY public.sockets_to_sessions (socket_id, session_id) FROM stdin;
fp3BQlFptngHEasrAAAD	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
p_RX8A5bWlzlHexWAAAF	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
BCqGl6T_VZxStFT_AAAH	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
JFuZWaWaojEok7QTAAAB	\N
FHE47KCrjSvtBdw6AAAD	\N
WzPCKhLAcZn_RLzQAAAF	\N
VUSzdA8raB0YRaZZAAAJ	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
iiIG-A2nkX3Y0RpmAAAL	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
N_dFORXCcbW-pZeQAAAN	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
tHq04_q29LThAqZ1AAAP	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
YwggL4j0GxC_8uK9AAAR	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
S5RUI3-OHxFdQ97hAAAT	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
WjNsHFRnu7sn_2WbAAAV	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
lwFvsHqfpFIlHGHSAAAX	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
RC0SuLqsF70F4wzwAAAZ	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
OrJ7BTQa4QxcqropAAAb	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
e2e_2Z9FoseelDwqAAAd	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
V-9sZj-om0vSiKNVAAAf	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
L8PPNj-tJG5AkZHYAAAh	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
pRu4yPieEOV7rQscAAAj	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
SmpDz9Espsw2FPseAAAl	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
ZhTdKpEWTr8i6CdJAAAn	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
OUGgujOtzSX6SS_kAAAp	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
bWY8-2LNLUhCji8yAAAr	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
8-JCQRgoIzm_F9gqAAAt	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
rKK2LIUJcO4mDREJAAAv	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
W0chEBgizgyxEw7hAAAx	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
X1fdWUMq_VpgxXjSAAAz	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
lakQJnPxacEg_QlfAAA1	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
38O1sJnNwZhUeBDDAAA3	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
yJ-VEnaCIYEzDFvZAAA5	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
EjcNJpL9UIJOm53_AAA7	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
vsyKPnOzH1-xNns6AAA9	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
SodxV2NhtNjiTj5-AAA_	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
dJTNU2Zu2ktvQ83AAAAB	SommChHfvDhxr9IyS7w4WWUiGy9aCaPU
zWqYOYEj3WcLXxYPAABB	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
VXFXjlX8-Wkm0BwwAABD	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
LMmhRpYBMPBki8XtAABF	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
t8jhMJ0bZM65G2SFAABH	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
KM9d0u_PBxvCEZf9AABJ	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
42jvu3IvNTFb194AAABL	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
SzMX1rsn1fSCl57BAABN	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
AbrOHa--ZSE7baixAABP	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
g15XbMMrlPMluDtWAABR	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
q_g14oBy4bDjhNyoAABT	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
b7Z-tGUzqzok7NbnAABV	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
saPt8TsuEbCBoS7iAABX	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
jhKd9U5OsWSXwKCsAABZ	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
IR_bCtT16l9TPfpyAABb	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
fmQxXs-45jUrFk_BAABd	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
j69F_x2GnPI_YvphAABf	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
F-eklDV-eD4aRoE1AABh	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
VDPwhwt4I9vda1LtAABj	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
GWq0PLA-GPQScxOHAABl	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
R3Q-Br2-OkFxGNLXAABn	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
v8G_ESZ6E23wyinnAABp	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
ngNJZiD8y0PKV1p5AABr	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
7S2j1FBiBL2tJvkDAABt	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
wtE0N5NSTDqXZTaLAABv	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
7r2_-U_wqA5Qu1hQAABx	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
tPPZ_nR9EnGOgIgNAABz	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
BYlyahC7X2_hRwyiAAB1	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
cWQeJDJdgHbPxpJ5AAB3	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
hnzvTm1yBHkZXK_3AAB5	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
eN1pXsjQ92brdlSlAAB7	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
v8WpWWgUBebr95OiAAB9	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
bA6q0rUqZO1s-PJ1AAB_	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
-0zM7tNtfGJTM4SRAACB	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
nR4mtNT0uQ2mbX2SAACD	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
dU_TMjkKMGCOupnOAACF	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
SNXumvY4dDFEosiKAACH	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
26cEnQmBYAg3YIsgAACJ	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
gpHNEjq2nhxpSxDvAACL	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
Yi-icyrinxLCl-m6AACN	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
ccdF7R_aYzkneJjaAACP	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
UUUSQMuDg4bwyXFtAACR	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
C0SlBcvnRKTX1YaTAACT	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
EfRrzPOlbqgbxvPsAACV	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
GDdB2CR-QmtwG_xyAACX	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
OtBGvJo1YhhWzxwoAACZ	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
mAAQqOemGhNCWu1lAACb	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
Brc2770DLKv9UVKaAACd	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
Gf3pw8xq91MTJN5YAACf	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
IzckWDID8IMebk-9AACh	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
iGGm62Vekc1ug4qAAACj	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
glLjZ2e4HytzjAYdAACl	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
BUgwmN0tw5TBynPSAACn	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
cLQV5PE63FeqehhdAACp	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
POJgDxWZ4yJUrkZRAAAB	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
J_RasV3nVyDg6qIRAAAD	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
RZ8OiGvQto3LDNc8AAAF	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
45mdf4LdUnfTFCoiAAAH	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
AZttF1GrpYxEC-8uAAAJ	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
XOB74z_xfrMiqdymAAAL	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
kCNJ4YVI0NQYPz3mAAAN	Kir2EPKv9LF7lHipk5JTbFWywXbp1ejy
9wNkVbZh7P8n4XGJAAAP	Kir2EPKv9LF7lHipk5JTbFWywXbp1ejy
f32xOLCzYTeXw9MNAAAR	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
2T7YgyrWDnwfdUp2AAAT	Kir2EPKv9LF7lHipk5JTbFWywXbp1ejy
pOppsCYMSSJlXzs2AAAV	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
fgJfsvaY2nshrwk4AAAX	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
7mYsWjIgVdeutXMXAAAZ	Kir2EPKv9LF7lHipk5JTbFWywXbp1ejy
JfDdgQ-uMyd5EnXaAAAb	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
J-b79QbGNtjuIRlMAAAd	I_thMYDWPE2KSrMaWRTAW9FSAdS_UUqc
S33mrF6pb4OdRIoVAAAf	Kir2EPKv9LF7lHipk5JTbFWywXbp1ejy
\.


--
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: rishimaheshwari
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (room_id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: rishimaheshwari
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: sockets_to_sessions sockets_to_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: rishimaheshwari
--

ALTER TABLE ONLY public.sockets_to_sessions
    ADD CONSTRAINT sockets_to_sessions_pkey PRIMARY KEY (socket_id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: rishimaheshwari
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: room_id_base_to_duplicates_count fk_room_id_base; Type: FK CONSTRAINT; Schema: public; Owner: rishimaheshwari
--

ALTER TABLE ONLY public.room_id_base_to_duplicates_count
    ADD CONSTRAINT fk_room_id_base FOREIGN KEY (room_id_base) REFERENCES public.rooms(room_id);


--
-- Name: sockets_to_rooms sockets_to_rooms_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rishimaheshwari
--

ALTER TABLE ONLY public.sockets_to_rooms
    ADD CONSTRAINT sockets_to_rooms_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(room_id);


--
-- Name: sockets_to_sessions sockets_to_sessions_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rishimaheshwari
--

ALTER TABLE ONLY public.sockets_to_sessions
    ADD CONSTRAINT sockets_to_sessions_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.session(sid);


--
-- PostgreSQL database dump complete
--

