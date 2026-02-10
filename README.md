# Mini Status Page – Docker Compose Project

Este projeto é uma aplicação simples de **Status Page**, desenvolvida como atividade acadêmica da disciplina de **Sistemas Distribuídos**, com o objetivo de demonstrar o uso de **orquestração de serviços utilizando Docker Compose**.

A aplicação monitora o status de serviços web, registra mudanças de estado (ONLINE/OFFLINE), mantém um histórico dessas mudanças e expõe métricas para monitoramento via Prometheus.

---

## 📌 Objetivo do Projeto

Demonstrar, na prática, os seguintes conceitos:

- Orquestração de múltiplos containers com Docker Compose
- Comunicação entre serviços em rede Docker
- Backend com Node.js e Express
- Banco de dados PostgreSQL
- Frontend simples servido via Nginx
- Coleta de métricas com Prometheus
- Persistência de histórico de disponibilidade dos serviços

---

## 🧱 Arquitetura da Aplicação

A aplicação é composta por quatro serviços principais:

- **Backend**: API em Node.js responsável pelo health check, histórico e métricas
- **Frontend**: Página HTML servida pelo Nginx para visualização do status
- **Database**: PostgreSQL para armazenar serviços e histórico de status
- **Prometheus**: Ferramenta de monitoramento para coleta de métricas

Todos os serviços são orquestrados utilizando Docker Compose.

---

## 🚀 Tecnologias Utilizadas

- Docker
- Docker Compose
- Node.js (Express)
- PostgreSQL
- Nginx
- Prometheus
- HTML, CSS e JavaScript puro

---

## 📂 Estrutura do Projeto

```text
mini-status-page/
├── backend/
│   ├── index.js
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   └── index.html
├── prometheus/
│   └── prometheus.yml
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

- Docker
- Docker Compose

## ▶️ Como Executar o Projeto

Clone o repositório:

```
git clone <URL_DO_REPOSITORIO>  
cd mini-status-page
```

Suba os containers com Docker Compose:

```
docker compose up --build
```

Aguarde alguns segundos até que todos os serviços estejam em execução.

## 🌐 Acessos da Aplicação

Frontend (Status Page):  
http://localhost:8080

Backend (API):  
http://localhost:3000/services

Prometheus:  
http://localhost:9090

Métricas do Backend:  
http://localhost:3000/metrics

## 🔁 Funcionamento do Health Check

O backend executa um health check automático a cada 30 segundos.

Para cada serviço cadastrado:

- Verifica se a URL está acessível
- Atualiza o status atual (ONLINE ou OFFLINE)
- Registra no histórico apenas quando ocorre mudança de status

O histórico pode ser consultado individualmente por serviço no frontend.

## 📊 Histórico de Status

O sistema mantém um histórico de disponibilidade de cada serviço, permitindo visualizar:

- Quando o serviço ficou ONLINE ou OFFLINE
- Data e hora de cada mudança
- Últimos 20 registros por serviço

Esse recurso torna o projeto mais próximo de soluções reais de monitoramento.

## 📈 Monitoramento com Prometheus

O backend expõe métricas padrão da aplicação Node.js utilizando a biblioteca prom-client.  
Essas métricas são coletadas automaticamente pelo Prometheus, permitindo análises de desempenho e disponibilidade.

## 📝 Considerações Finais

Este projeto atende aos requisitos propostos pela atividade acadêmica, demonstrando:

- Uso correto de Docker Compose
- Integração entre múltiplos serviços
- Monitoramento básico de aplicações distribuídas
- Persistência e visualização de dados de status

Apesar de simples, o projeto reflete conceitos fundamentais de sistemas distribuídos e pode ser facilmente expandido com autenticação, dashboards mais avançados ou alertas automáticos.

## 👨‍🎓 Autor

Projeto desenvolvido para fins acadêmicos.
