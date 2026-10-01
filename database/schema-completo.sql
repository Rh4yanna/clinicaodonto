-- Odonto: estrutura final das migrations 001-018. Gerado em 2026-09-29.
-- SOMENTE PARA BANCO NOVO/VAZIO. Nao usar para atualizar banco existente.
-- Inclui categorias iniciais e historico de migrations; nenhum paciente/usuario real.
BEGIN;
--
-- PostgreSQL database dump
--


-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

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
-- Name: _migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._migrations (
    nome_arquivo text NOT NULL,
    aplicada_em timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: alergia_paciente; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alergia_paciente (
    id integer NOT NULL,
    paciente_id integer NOT NULL,
    substancia character varying NOT NULL,
    gravidade character varying
);


--
-- Name: alergia_paciente_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.alergia_paciente_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: alergia_paciente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.alergia_paciente_id_seq OWNED BY public.alergia_paciente.id;


--
-- Name: categoria; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categoria (
    id integer NOT NULL,
    nome character varying NOT NULL
);


--
-- Name: categoria_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categoria_id_seq OWNED BY public.categoria.id;


--
-- Name: cirurgia; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cirurgia (
    id integer NOT NULL,
    paciente_id integer NOT NULL,
    usuario_id integer NOT NULL,
    data_hora timestamp without time zone NOT NULL,
    tipo_cirurgia character varying,
    status character varying DEFAULT 'agendada'::character varying,
    observacoes text,
    mutirao_id integer,
    disciplina character varying(50),
    CONSTRAINT chk_cirurgia_disciplina CHECK (((disciplina IS NULL) OR ((disciplina)::text = ANY ((ARRAY['Dentística'::character varying, 'Endodontia'::character varying, 'Periodontia'::character varying, 'Ortodontia'::character varying, 'Odontopediatria'::character varying, 'Cirurgia Bucal'::character varying, 'Prótese'::character varying, 'Reabilitação Bucal'::character varying])::text[])))),
    CONSTRAINT chk_cirurgia_status CHECK (((status)::text = ANY ((ARRAY['agendada'::character varying, 'realizada'::character varying, 'cancelada'::character varying])::text[])))
);


--
-- Name: cirurgia_aluno; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cirurgia_aluno (
    id integer NOT NULL,
    cirurgia_id integer NOT NULL,
    usuario_id integer NOT NULL,
    curso character varying,
    papel character varying DEFAULT 'observador'::character varying,
    criado_em timestamp without time zone DEFAULT now(),
    CONSTRAINT cirurgia_aluno_papel_check CHECK (((papel)::text = ANY ((ARRAY['executante'::character varying, 'auxiliar'::character varying, 'observador'::character varying])::text[])))
);


--
-- Name: cirurgia_aluno_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cirurgia_aluno_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cirurgia_aluno_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cirurgia_aluno_id_seq OWNED BY public.cirurgia_aluno.id;


--
-- Name: cirurgia_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cirurgia_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cirurgia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cirurgia_id_seq OWNED BY public.cirurgia.id;


--
-- Name: cirurgia_material; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cirurgia_material (
    id integer NOT NULL,
    cirurgia_id integer NOT NULL,
    material_id integer NOT NULL,
    quantidade integer DEFAULT 1 NOT NULL,
    criado_em timestamp without time zone DEFAULT now(),
    CONSTRAINT chk_cirurgia_material_quantidade CHECK ((quantidade >= 0))
);


--
-- Name: cirurgia_material_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cirurgia_material_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cirurgia_material_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cirurgia_material_id_seq OWNED BY public.cirurgia_material.id;


--
-- Name: consulta; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.consulta (
    id integer NOT NULL,
    paciente_id integer NOT NULL,
    usuario_id integer NOT NULL,
    data_hora timestamp without time zone NOT NULL,
    queixa_principal character varying,
    observacoes text,
    status character varying DEFAULT 'agendada'::character varying,
    disciplina character varying(50),
    CONSTRAINT chk_consulta_disciplina CHECK (((disciplina IS NULL) OR ((disciplina)::text = ANY ((ARRAY['Dentística'::character varying, 'Endodontia'::character varying, 'Periodontia'::character varying, 'Ortodontia'::character varying, 'Odontopediatria'::character varying, 'Cirurgia Bucal'::character varying, 'Prótese'::character varying, 'Reabilitação Bucal'::character varying])::text[])))),
    CONSTRAINT chk_consulta_status CHECK (((status)::text = ANY ((ARRAY['agendada'::character varying, 'confirmada'::character varying, 'aguardando'::character varying, 'em_atendimento'::character varying, 'realizada'::character varying, 'cancelada'::character varying, 'faltou'::character varying])::text[])))
);


--
-- Name: consulta_aluno; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.consulta_aluno (
    consulta_id integer NOT NULL,
    aluno_id integer NOT NULL
);


--
-- Name: consulta_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.consulta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: consulta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.consulta_id_seq OWNED BY public.consulta.id;


--
-- Name: consulta_material; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.consulta_material (
    id integer NOT NULL,
    consulta_id integer NOT NULL,
    material_id integer NOT NULL,
    quantidade integer DEFAULT 1 NOT NULL,
    criado_em timestamp without time zone DEFAULT now(),
    CONSTRAINT chk_consulta_material_quantidade CHECK ((quantidade >= 0))
);


--
-- Name: consulta_material_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.consulta_material_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: consulta_material_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.consulta_material_id_seq OWNED BY public.consulta_material.id;


--
-- Name: controle_biologico; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.controle_biologico (
    id integer NOT NULL,
    esterilizacao_id integer NOT NULL,
    tipo character varying NOT NULL,
    resultado character varying DEFAULT 'pendente'::character varying NOT NULL,
    lote_indicador character varying,
    data_teste timestamp without time zone DEFAULT now(),
    testado_por_id integer,
    observacao text,
    criado_em timestamp without time zone DEFAULT now(),
    CONSTRAINT controle_biologico_resultado_check CHECK (((resultado)::text = ANY ((ARRAY['pendente'::character varying, 'aprovado'::character varying, 'reprovado'::character varying])::text[]))),
    CONSTRAINT controle_biologico_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['bowie_dick'::character varying, 'biologico'::character varying, 'quimico'::character varying])::text[])))
);


--
-- Name: controle_biologico_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.controle_biologico_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: controle_biologico_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.controle_biologico_id_seq OWNED BY public.controle_biologico.id;


--
-- Name: documento_paciente; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.documento_paciente (
    id integer NOT NULL,
    paciente_id integer NOT NULL,
    usuario_id integer NOT NULL,
    nome_arquivo character varying NOT NULL,
    tipo_arquivo character varying,
    tamanho_bytes integer,
    conteudo bytea NOT NULL,
    criado_em timestamp without time zone DEFAULT now()
);


--
-- Name: documento_paciente_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.documento_paciente_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: documento_paciente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.documento_paciente_id_seq OWNED BY public.documento_paciente.id;


--
-- Name: esterilizacao; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.esterilizacao (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    data_hora timestamp without time zone DEFAULT now(),
    resultado character varying DEFAULT 'pendente'::character varying,
    controle_biologico boolean DEFAULT false,
    observacoes text,
    equipamento character varying,
    tipo_ciclo character varying DEFAULT 'vapor'::character varying,
    temperatura numeric(5,1),
    pressao numeric(5,2),
    duracao_minutos integer,
    status character varying DEFAULT 'pendente'::character varying,
    CONSTRAINT chk_esterilizacao_resultado CHECK (((resultado)::text = ANY ((ARRAY['pendente'::character varying, 'aprovado'::character varying, 'reprovado'::character varying])::text[]))),
    CONSTRAINT esterilizacao_status_check CHECK (((status)::text = ANY ((ARRAY['pendente'::character varying, 'em_andamento'::character varying, 'concluido'::character varying, 'falhou'::character varying])::text[]))),
    CONSTRAINT esterilizacao_tipo_ciclo_check CHECK (((tipo_ciclo)::text = ANY ((ARRAY['vapor'::character varying, 'calor_seco'::character varying, 'plasma'::character varying])::text[])))
);


--
-- Name: esterilizacao_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.esterilizacao_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: esterilizacao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.esterilizacao_id_seq OWNED BY public.esterilizacao.id;


--
-- Name: evolucao_paciente; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evolucao_paciente (
    id integer NOT NULL,
    paciente_id integer NOT NULL,
    usuario_id integer NOT NULL,
    consulta_id integer,
    descricao text NOT NULL,
    criado_em timestamp without time zone DEFAULT now(),
    cirurgia_id integer
);


--
-- Name: evolucao_paciente_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evolucao_paciente_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evolucao_paciente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evolucao_paciente_id_seq OWNED BY public.evolucao_paciente.id;


--
-- Name: material; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.material (
    id integer NOT NULL,
    nome character varying NOT NULL,
    unidade_medida character varying,
    quantidade integer DEFAULT 0 NOT NULL,
    estoque_minimo integer DEFAULT 5 NOT NULL,
    codigo_barras character varying,
    criado_em timestamp without time zone DEFAULT now(),
    categoria_id integer,
    estoque_ideal integer,
    fabricante character varying,
    lote character varying,
    registro_anvisa character varying,
    data_entrada date,
    validade date,
    imagem_base64 text,
    descricao text,
    tipo_material character varying DEFAULT 'consumivel'::character varying NOT NULL,
    passa_cme boolean DEFAULT false NOT NULL,
    CONSTRAINT chk_material_estoque_ideal CHECK (((estoque_ideal IS NULL) OR (estoque_ideal >= estoque_minimo))),
    CONSTRAINT chk_material_quantidade_nao_negativa CHECK ((quantidade >= 0)),
    CONSTRAINT material_tipo_material_check CHECK (((tipo_material)::text = ANY ((ARRAY['consumivel'::character varying, 'instrumental'::character varying])::text[])))
);


--
-- Name: material_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.material_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: material_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.material_id_seq OWNED BY public.material.id;


--
-- Name: material_lote; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.material_lote (
    id integer NOT NULL,
    material_id integer NOT NULL,
    lote character varying NOT NULL,
    validade date,
    quantidade integer DEFAULT 0 NOT NULL,
    data_recebimento date DEFAULT CURRENT_DATE NOT NULL,
    fornecedor character varying,
    observacao text,
    CONSTRAINT material_lote_quantidade_check CHECK ((quantidade >= 0))
);


--
-- Name: material_lote_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.material_lote_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: material_lote_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.material_lote_id_seq OWNED BY public.material_lote.id;


--
-- Name: medicamento_paciente; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.medicamento_paciente (
    id integer NOT NULL,
    paciente_id integer NOT NULL,
    nome_medicamento character varying NOT NULL,
    dosagem character varying
);


--
-- Name: medicamento_paciente_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.medicamento_paciente_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: medicamento_paciente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.medicamento_paciente_id_seq OWNED BY public.medicamento_paciente.id;


--
-- Name: movimentacao_estoque; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.movimentacao_estoque (
    id integer NOT NULL,
    material_id integer NOT NULL,
    usuario_id integer NOT NULL,
    tipo character varying NOT NULL,
    quantidade integer NOT NULL,
    data_hora timestamp without time zone DEFAULT now(),
    observacao text,
    lote_id integer,
    data_recebimento date,
    fornecedor character varying,
    CONSTRAINT chk_movimentacao_tipo CHECK (((tipo)::text = ANY ((ARRAY['entrada'::character varying, 'saida'::character varying])::text[])))
);


--
-- Name: movimentacao_estoque_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.movimentacao_estoque_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: movimentacao_estoque_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.movimentacao_estoque_id_seq OWNED BY public.movimentacao_estoque.id;


--
-- Name: mutirao_cirurgico; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mutirao_cirurgico (
    id integer NOT NULL,
    nome character varying NOT NULL,
    data_evento date NOT NULL,
    local character varying,
    usuario_id integer NOT NULL,
    observacoes text,
    criado_em timestamp without time zone DEFAULT now()
);


--
-- Name: mutirao_cirurgico_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.mutirao_cirurgico_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: mutirao_cirurgico_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mutirao_cirurgico_id_seq OWNED BY public.mutirao_cirurgico.id;


--
-- Name: notificacao; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notificacao (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    titulo character varying NOT NULL,
    mensagem text,
    tipo character varying DEFAULT 'sistema'::character varying NOT NULL,
    link character varying,
    referencia_id integer,
    lida boolean DEFAULT false NOT NULL,
    lida_em timestamp without time zone,
    criado_em timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: notificacao_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notificacao_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notificacao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notificacao_id_seq OWNED BY public.notificacao.id;


--
-- Name: paciente; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.paciente (
    id integer NOT NULL,
    nome character varying NOT NULL,
    cpf character varying NOT NULL,
    data_nascimento date NOT NULL,
    telefone character varying,
    email character varying,
    endereco character varying,
    criado_em timestamp without time zone DEFAULT now(),
    ativo boolean DEFAULT true,
    alergias_status character varying,
    medicamentos_status character varying,
    saude_versao integer DEFAULT 0 NOT NULL,
    CONSTRAINT paciente_alergias_status_check CHECK (((alergias_status)::text = ANY ((ARRAY['informado'::character varying, 'nenhum'::character varying])::text[]))),
    CONSTRAINT paciente_medicamentos_status_check CHECK (((medicamentos_status)::text = ANY ((ARRAY['informado'::character varying, 'nenhum'::character varying])::text[])))
);


--
-- Name: paciente_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.paciente_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: paciente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.paciente_id_seq OWNED BY public.paciente.id;


--
-- Name: pacote_esterilizado; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pacote_esterilizado (
    id integer NOT NULL,
    esterilizacao_id integer,
    material_id integer,
    qr_code character varying,
    status character varying DEFAULT 'esterilizado'::character varying,
    validade date,
    criado_em timestamp without time zone DEFAULT now(),
    nome character varying,
    preparado_por integer,
    liberado_por integer,
    CONSTRAINT chk_pacote_status CHECK (((status)::text = ANY ((ARRAY['aguardando'::character varying, 'em_esterilizacao'::character varying, 'esterilizado'::character varying, 'utilizado'::character varying, 'vencido'::character varying])::text[])))
);


--
-- Name: pacote_esterilizado_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pacote_esterilizado_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pacote_esterilizado_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pacote_esterilizado_id_seq OWNED BY public.pacote_esterilizado.id;


--
-- Name: pacote_evento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pacote_evento (
    id integer NOT NULL,
    pacote_id integer NOT NULL,
    usuario_id integer NOT NULL,
    evento character varying NOT NULL,
    criado_em timestamp without time zone DEFAULT now()
);


--
-- Name: pacote_evento_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pacote_evento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pacote_evento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pacote_evento_id_seq OWNED BY public.pacote_evento.id;


--
-- Name: pacote_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pacote_item (
    pacote_id integer NOT NULL,
    material_id integer NOT NULL,
    quantidade integer NOT NULL,
    CONSTRAINT pacote_item_quantidade_check CHECK ((quantidade > 0))
);


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuario (
    id integer NOT NULL,
    nome character varying NOT NULL,
    cpf character varying NOT NULL,
    email character varying NOT NULL,
    senha_hash character varying NOT NULL,
    telefone character varying,
    setor character varying,
    perfil character varying NOT NULL,
    data_admissao date,
    ativo boolean DEFAULT true,
    criado_em timestamp without time zone DEFAULT now(),
    reset_token character varying,
    reset_token_expires timestamp without time zone,
    reset_attempts integer DEFAULT 0 NOT NULL,
    reset_requested_at timestamp with time zone,
    CONSTRAINT chk_usuario_perfil CHECK (((perfil)::text = ANY ((ARRAY['coordenador'::character varying, 'professor'::character varying, 'aluno'::character varying, 'recepcionista'::character varying])::text[])))
);


--
-- Name: usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuario_id_seq OWNED BY public.usuario.id;


--
-- Name: alergia_paciente id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alergia_paciente ALTER COLUMN id SET DEFAULT nextval('public.alergia_paciente_id_seq'::regclass);


--
-- Name: categoria id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categoria ALTER COLUMN id SET DEFAULT nextval('public.categoria_id_seq'::regclass);


--
-- Name: cirurgia id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cirurgia ALTER COLUMN id SET DEFAULT nextval('public.cirurgia_id_seq'::regclass);


--
-- Name: cirurgia_aluno id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cirurgia_aluno ALTER COLUMN id SET DEFAULT nextval('public.cirurgia_aluno_id_seq'::regclass);


--
-- Name: cirurgia_material id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cirurgia_material ALTER COLUMN id SET DEFAULT nextval('public.cirurgia_material_id_seq'::regclass);


--
-- Name: consulta id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consulta ALTER COLUMN id SET DEFAULT nextval('public.consulta_id_seq'::regclass);


--
-- Name: consulta_material id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consulta_material ALTER COLUMN id SET DEFAULT nextval('public.consulta_material_id_seq'::regclass);


--
-- Name: controle_biologico id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.controle_biologico ALTER COLUMN id SET DEFAULT nextval('public.controle_biologico_id_seq'::regclass);


--
-- Name: documento_paciente id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documento_paciente ALTER COLUMN id SET DEFAULT nextval('public.documento_paciente_id_seq'::regclass);


--
-- Name: esterilizacao id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esterilizacao ALTER COLUMN id SET DEFAULT nextval('public.esterilizacao_id_seq'::regclass);


--
-- Name: evolucao_paciente id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evolucao_paciente ALTER COLUMN id SET DEFAULT nextval('public.evolucao_paciente_id_seq'::regclass);


--
-- Name: material id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.material ALTER COLUMN id SET DEFAULT nextval('public.material_id_seq'::regclass);


--
-- Name: material_lote id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.material_lote ALTER COLUMN id SET DEFAULT nextval('public.material_lote_id_seq'::regclass);


--
-- Name: medicamento_paciente id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicamento_paciente ALTER COLUMN id SET DEFAULT nextval('public.medicamento_paciente_id_seq'::regclass);


--
-- Name: movimentacao_estoque id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimentacao_estoque ALTER COLUMN id SET DEFAULT nextval('public.movimentacao_estoque_id_seq'::regclass);


--
-- Name: mutirao_cirurgico id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mutirao_cirurgico ALTER COLUMN id SET DEFAULT nextval('public.mutirao_cirurgico_id_seq'::regclass);


--
-- Name: notificacao id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notificacao ALTER COLUMN id SET DEFAULT nextval('public.notificacao_id_seq'::regclass);


--
-- Name: paciente id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paciente ALTER COLUMN id SET DEFAULT nextval('public.paciente_id_seq'::regclass);


--
-- Name: pacote_esterilizado id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pacote_esterilizado ALTER COLUMN id SET DEFAULT nextval('public.pacote_esterilizado_id_seq'::regclass);


--
-- Name: pacote_evento id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pacote_evento ALTER COLUMN id SET DEFAULT nextval('public.pacote_evento_id_seq'::regclass);


--
-- Name: usuario id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id SET DEFAULT nextval('public.usuario_id_seq'::regclass);


--
-- Name: _migrations _migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._migrations
    ADD CONSTRAINT _migrations_pkey PRIMARY KEY (nome_arquivo);


--
-- Name: alergia_paciente alergia_paciente_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alergia_paciente
    ADD CONSTRAINT alergia_paciente_pkey PRIMARY KEY (id);


--
-- Name: categoria categoria_nome_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_nome_key UNIQUE (nome);


--
-- Name: categoria categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_pkey PRIMARY KEY (id);


--
-- Name: cirurgia_aluno cirurgia_aluno_cirurgia_id_usuario_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cirurgia_aluno
    ADD CONSTRAINT cirurgia_aluno_cirurgia_id_usuario_id_key UNIQUE (cirurgia_id, usuario_id);


--
-- Name: cirurgia_aluno cirurgia_aluno_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cirurgia_aluno
    ADD CONSTRAINT cirurgia_aluno_pkey PRIMARY KEY (id);


--
-- Name: cirurgia_material cirurgia_material_cirurgia_id_material_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cirurgia_material
    ADD CONSTRAINT cirurgia_material_cirurgia_id_material_id_key UNIQUE (cirurgia_id, material_id);


--
-- Name: cirurgia_material cirurgia_material_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cirurgia_material
    ADD CONSTRAINT cirurgia_material_pkey PRIMARY KEY (id);


--
-- Name: cirurgia cirurgia_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cirurgia
    ADD CONSTRAINT cirurgia_pkey PRIMARY KEY (id);


--
-- Name: consulta_aluno consulta_aluno_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consulta_aluno
    ADD CONSTRAINT consulta_aluno_pkey PRIMARY KEY (consulta_id, aluno_id);


--
-- Name: consulta_material consulta_material_consulta_id_material_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consulta_material
    ADD CONSTRAINT consulta_material_consulta_id_material_id_key UNIQUE (consulta_id, material_id);


--
-- Name: consulta_material consulta_material_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consulta_material
    ADD CONSTRAINT consulta_material_pkey PRIMARY KEY (id);


--
-- Name: consulta consulta_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consulta
    ADD CONSTRAINT consulta_pkey PRIMARY KEY (id);


--
-- Name: controle_biologico controle_biologico_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.controle_biologico
    ADD CONSTRAINT controle_biologico_pkey PRIMARY KEY (id);


--
-- Name: documento_paciente documento_paciente_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documento_paciente
    ADD CONSTRAINT documento_paciente_pkey PRIMARY KEY (id);


--
-- Name: esterilizacao esterilizacao_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esterilizacao
    ADD CONSTRAINT esterilizacao_pkey PRIMARY KEY (id);


--
-- Name: evolucao_paciente evolucao_paciente_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evolucao_paciente
    ADD CONSTRAINT evolucao_paciente_pkey PRIMARY KEY (id);


--
-- Name: material_lote material_lote_material_id_lote_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.material_lote
    ADD CONSTRAINT material_lote_material_id_lote_key UNIQUE (material_id, lote);


--
-- Name: material_lote material_lote_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.material_lote
    ADD CONSTRAINT material_lote_pkey PRIMARY KEY (id);


--
-- Name: material material_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.material
    ADD CONSTRAINT material_pkey PRIMARY KEY (id);


--
-- Name: medicamento_paciente medicamento_paciente_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicamento_paciente
    ADD CONSTRAINT medicamento_paciente_pkey PRIMARY KEY (id);


--
-- Name: movimentacao_estoque movimentacao_estoque_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimentacao_estoque
    ADD CONSTRAINT movimentacao_estoque_pkey PRIMARY KEY (id);


--
-- Name: mutirao_cirurgico mutirao_cirurgico_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mutirao_cirurgico
    ADD CONSTRAINT mutirao_cirurgico_pkey PRIMARY KEY (id);


--
-- Name: notificacao notificacao_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notificacao
    ADD CONSTRAINT notificacao_pkey PRIMARY KEY (id);


--
-- Name: paciente paciente_cpf_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT paciente_cpf_key UNIQUE (cpf);


--
-- Name: paciente paciente_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT paciente_pkey PRIMARY KEY (id);


--
-- Name: pacote_esterilizado pacote_esterilizado_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pacote_esterilizado
    ADD CONSTRAINT pacote_esterilizado_pkey PRIMARY KEY (id);


--
-- Name: pacote_evento pacote_evento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pacote_evento
    ADD CONSTRAINT pacote_evento_pkey PRIMARY KEY (id);


--
-- Name: pacote_item pacote_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pacote_item
    ADD CONSTRAINT pacote_item_pkey PRIMARY KEY (pacote_id, material_id);


--
-- Name: material uq_material_codigo_barras; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.material
    ADD CONSTRAINT uq_material_codigo_barras UNIQUE (codigo_barras);


--
-- Name: pacote_esterilizado uq_pacote_esterilizado_qr_code; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pacote_esterilizado
    ADD CONSTRAINT uq_pacote_esterilizado_qr_code UNIQUE (qr_code);


--
-- Name: usuario usuario_cpf_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_cpf_key UNIQUE (cpf);


--
-- Name: usuario usuario_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);


--
-- Name: idx_consulta_disciplina; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_consulta_disciplina ON public.consulta USING btree (disciplina, data_hora);


--
-- Name: idx_consulta_material_consulta; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_consulta_material_consulta ON public.consulta_material USING btree (consulta_id);


--
-- Name: idx_documento_paciente; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_documento_paciente ON public.documento_paciente USING btree (paciente_id, criado_em DESC);


--
-- Name: idx_notificacao_nao_lidas; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notificacao_nao_lidas ON public.notificacao USING btree (usuario_id) WHERE (lida = false);


--
-- Name: idx_notificacao_usuario; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notificacao_usuario ON public.notificacao USING btree (usuario_id, criado_em DESC);


--
-- Name: alergia_paciente alergia_paciente_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alergia_paciente
    ADD CONSTRAINT alergia_paciente_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.paciente(id) ON DELETE CASCADE;


--
-- Name: cirurgia_aluno cirurgia_aluno_cirurgia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cirurgia_aluno
    ADD CONSTRAINT cirurgia_aluno_cirurgia_id_fkey FOREIGN KEY (cirurgia_id) REFERENCES public.cirurgia(id) ON DELETE CASCADE;


--
-- Name: cirurgia_aluno cirurgia_aluno_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cirurgia_aluno
    ADD CONSTRAINT cirurgia_aluno_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id);


--
-- Name: cirurgia_material cirurgia_material_cirurgia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cirurgia_material
    ADD CONSTRAINT cirurgia_material_cirurgia_id_fkey FOREIGN KEY (cirurgia_id) REFERENCES public.cirurgia(id) ON DELETE CASCADE;


--
-- Name: cirurgia_material cirurgia_material_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cirurgia_material
    ADD CONSTRAINT cirurgia_material_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.material(id);


--
-- Name: cirurgia cirurgia_mutirao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cirurgia
    ADD CONSTRAINT cirurgia_mutirao_id_fkey FOREIGN KEY (mutirao_id) REFERENCES public.mutirao_cirurgico(id);


--
-- Name: cirurgia cirurgia_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cirurgia
    ADD CONSTRAINT cirurgia_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.paciente(id);


--
-- Name: cirurgia cirurgia_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cirurgia
    ADD CONSTRAINT cirurgia_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id);


--
-- Name: consulta_aluno consulta_aluno_aluno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consulta_aluno
    ADD CONSTRAINT consulta_aluno_aluno_id_fkey FOREIGN KEY (aluno_id) REFERENCES public.usuario(id);


--
-- Name: consulta_aluno consulta_aluno_consulta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consulta_aluno
    ADD CONSTRAINT consulta_aluno_consulta_id_fkey FOREIGN KEY (consulta_id) REFERENCES public.consulta(id) ON DELETE CASCADE;


--
-- Name: consulta_material consulta_material_consulta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consulta_material
    ADD CONSTRAINT consulta_material_consulta_id_fkey FOREIGN KEY (consulta_id) REFERENCES public.consulta(id) ON DELETE CASCADE;


--
-- Name: consulta_material consulta_material_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consulta_material
    ADD CONSTRAINT consulta_material_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.material(id);


--
-- Name: consulta consulta_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consulta
    ADD CONSTRAINT consulta_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.paciente(id);


--
-- Name: consulta consulta_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consulta
    ADD CONSTRAINT consulta_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id);


--
-- Name: controle_biologico controle_biologico_esterilizacao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.controle_biologico
    ADD CONSTRAINT controle_biologico_esterilizacao_id_fkey FOREIGN KEY (esterilizacao_id) REFERENCES public.esterilizacao(id) ON DELETE CASCADE;


--
-- Name: controle_biologico controle_biologico_testado_por_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.controle_biologico
    ADD CONSTRAINT controle_biologico_testado_por_id_fkey FOREIGN KEY (testado_por_id) REFERENCES public.usuario(id);


--
-- Name: documento_paciente documento_paciente_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documento_paciente
    ADD CONSTRAINT documento_paciente_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.paciente(id) ON DELETE CASCADE;


--
-- Name: documento_paciente documento_paciente_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documento_paciente
    ADD CONSTRAINT documento_paciente_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id);


--
-- Name: esterilizacao esterilizacao_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.esterilizacao
    ADD CONSTRAINT esterilizacao_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id);


--
-- Name: evolucao_paciente evolucao_paciente_cirurgia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evolucao_paciente
    ADD CONSTRAINT evolucao_paciente_cirurgia_id_fkey FOREIGN KEY (cirurgia_id) REFERENCES public.cirurgia(id);


--
-- Name: evolucao_paciente evolucao_paciente_consulta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evolucao_paciente
    ADD CONSTRAINT evolucao_paciente_consulta_id_fkey FOREIGN KEY (consulta_id) REFERENCES public.consulta(id);


--
-- Name: evolucao_paciente evolucao_paciente_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evolucao_paciente
    ADD CONSTRAINT evolucao_paciente_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.paciente(id) ON DELETE CASCADE;


--
-- Name: evolucao_paciente evolucao_paciente_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evolucao_paciente
    ADD CONSTRAINT evolucao_paciente_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id);


--
-- Name: material material_categoria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.material
    ADD CONSTRAINT material_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categoria(id);


--
-- Name: material_lote material_lote_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.material_lote
    ADD CONSTRAINT material_lote_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.material(id);


--
-- Name: medicamento_paciente medicamento_paciente_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicamento_paciente
    ADD CONSTRAINT medicamento_paciente_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.paciente(id) ON DELETE CASCADE;


--
-- Name: movimentacao_estoque movimentacao_estoque_lote_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimentacao_estoque
    ADD CONSTRAINT movimentacao_estoque_lote_id_fkey FOREIGN KEY (lote_id) REFERENCES public.material_lote(id);


--
-- Name: movimentacao_estoque movimentacao_estoque_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimentacao_estoque
    ADD CONSTRAINT movimentacao_estoque_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.material(id);


--
-- Name: movimentacao_estoque movimentacao_estoque_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimentacao_estoque
    ADD CONSTRAINT movimentacao_estoque_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id);


--
-- Name: mutirao_cirurgico mutirao_cirurgico_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mutirao_cirurgico
    ADD CONSTRAINT mutirao_cirurgico_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id);


--
-- Name: notificacao notificacao_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notificacao
    ADD CONSTRAINT notificacao_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: pacote_esterilizado pacote_esterilizado_esterilizacao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pacote_esterilizado
    ADD CONSTRAINT pacote_esterilizado_esterilizacao_id_fkey FOREIGN KEY (esterilizacao_id) REFERENCES public.esterilizacao(id);


--
-- Name: pacote_esterilizado pacote_esterilizado_liberado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pacote_esterilizado
    ADD CONSTRAINT pacote_esterilizado_liberado_por_fkey FOREIGN KEY (liberado_por) REFERENCES public.usuario(id);


--
-- Name: pacote_esterilizado pacote_esterilizado_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pacote_esterilizado
    ADD CONSTRAINT pacote_esterilizado_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.material(id);


--
-- Name: pacote_esterilizado pacote_esterilizado_preparado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pacote_esterilizado
    ADD CONSTRAINT pacote_esterilizado_preparado_por_fkey FOREIGN KEY (preparado_por) REFERENCES public.usuario(id);


--
-- Name: pacote_evento pacote_evento_pacote_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pacote_evento
    ADD CONSTRAINT pacote_evento_pacote_id_fkey FOREIGN KEY (pacote_id) REFERENCES public.pacote_esterilizado(id);


--
-- Name: pacote_evento pacote_evento_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pacote_evento
    ADD CONSTRAINT pacote_evento_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id);


--
-- Name: pacote_item pacote_item_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pacote_item
    ADD CONSTRAINT pacote_item_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.material(id);


--
-- Name: pacote_item pacote_item_pacote_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pacote_item
    ADD CONSTRAINT pacote_item_pacote_id_fkey FOREIGN KEY (pacote_id) REFERENCES public.pacote_esterilizado(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--



INSERT INTO public.categoria (nome) VALUES ('Instrumentais'), ('Consumíveis'), ('Descartáveis'), ('Medicamentos'), ('Kits cirúrgicos');

INSERT INTO public._migrations (nome_arquivo) VALUES
('001_create_tables.sql'),
('002_ajustes_modelagem_fase3.sql'),
('003_estoque_sprint1.sql'),
('004_cme_sprint2.sql'),
('005_gaps_prototipo.sql'),
('006_materiais_cirurgia.sql'),
('007_material_imagem.sql'),
('008_recriar_alergia_medicamento.sql'),
('009_notificacoes.sql'),
('010_materiais_consulta.sql'),
('011_material_descricao.sql'),
('012_consulta_disciplina.sql'),
('013_corrige_documento_paciente.sql'),
('014_perfil_coordenador.sql'),
('015_recuperacao_codigo.sql'),
('016_recepcao_prontuario.sql'),
('017_lotes_pacotes_alunos.sql'),
('018_compatibilidade_status.sql');

SET search_path TO public;
COMMIT;
