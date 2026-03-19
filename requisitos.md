#  FlowDesk  
> *Centralize, organize e resolva — sem fricção.*


#  Visão Geral  
O **FlowDesk** é um sistema de gestão de chamados internos que conecta setores de uma empresa, permitindo abertura, acompanhamento e resolução de solicitações de forma estruturada, segura e escalável.

#  Requisitos Funcionais

##  Usuários e Autenticação
- RF01: Permitir o pré-cadastro de usuários por:
  - Responsável do setor  
  - Usuário com permissão adequada  
- RF02: Enviar link de convite por e-mail para finalização do cadastro  
- RF03: Usuário permanece **inativo** até concluir cadastro  
- RF04: Autenticação via **JWT**  
- RF05: Recuperação de senha  

##  Permissões e Perfis
- RF06: Permissões baseadas no setor do usuário  
- RF07: Perfis disponíveis:
  - Administrador  
  - Usuário padrão  
- RF08: Apenas administradores podem:
  - Visualizar chamados de todos os setores  
  - Gerenciar setores globalmente  
- RF09: Usuários comuns podem:
  - Visualizar chamados criados por eles  
  - Visualizar chamados do seu setor  

## Setores
- RF10: Cadastro de setores  
- RF11: Adicionar/remover usuários de um setor  
- RF12: Usuário deve estar vinculado a pelo menos um setor  

## Chamados
- RF13: Qualquer setor pode abrir chamado para outro setor  
- RF14: Chamado deve conter:
  - Título  
  - Descrição  
  - Setor solicitante  
  - Setor responsável  
  - Status  
  - Data de criação  
- RF15: Apenas setor responsável pode:
  - Atualizar chamado  
  - Alterar status  
- RF16: Membros do setor responsável devem:
  - Ser notificados ao criar chamado  
  - Ter acesso aos chamados do setor  
- RF17: Usuários podem acompanhar seus chamados  

## Status dos Chamados
- RF18: Status padrão:
  - Pendente  
  - Em Aberto  
  - Concluído  
- RF19: Permitir cadastro de novos status por setor  
- RF20: Status configurável por setor  


## Notificações
- RF21: Notificar setor responsável ao criar chamado  
- RF22: Notificações via:
  - E-mail  
  - (Futuro) WebSocket / tempo real  


## Visualização e Acompanhamento
- RF23: Usuário pode visualizar:
  - Chamados criados por ele  
  - Status dos chamados  
- RF24: Filtros:
  - Status  
  - Setor  
  - Data  


# Requisitos Não Funcionais

## Arquitetura
- RNF01: Utilizar **Clean Architecture**  
- RNF02: Separação em camadas:
  - Domain  
  - Application  
  - Infrastructure  
  - Interface (API)  


## Tecnologias
- RNF03: Backend: Django + Django REST Framework  
- RNF04: Frontend: Angular  
- RNF05: Banco de dados: PostgreSQL  
- RNF06: Autenticação: JWT  


## Estrutura do Projeto
- RNF07: Monorepositório: