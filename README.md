# 암호화폐 가상 거래 서비스 'JeayBit'
> JeayBit은 진입장벽이 낮고 경량화된 암호화폐 가상 거래 프로그램입니다. <br>
> 기존의 응답시간이 길고 복잡한 암호화폐 거래소들과는 달리, 필수적인 기능들만을 채택하여 개발한 트레이딩 뷰입니다. <br>
> 화폐 거래는 실제 거래가 아닌 임의의 가상 환경에서 진행됩니다. <br>
- 배포 URL: https://jeaybit.site

  
<br>

## 1. 프로젝트 개요

### 개발 기간
> 2023.08.28 - 2023.12.05 <br>
> 2024.05.26 ~ 2024.07.26(리팩토링)

### 인원 구성
> 이진우(1인)

### 기술

|Environment|Frontend|Backend|Database|Deployment|API|
|:---:|:---:|:---:|:---:|:---:|:---:|
|![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white) ![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)|![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)|![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white) ![Celery](https://img.shields.io/badge/celery-%23a9cc54.svg?style=for-the-badge&logo=celery&logoColor=ddf4a4)|![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)|![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white) ![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) <img width="110" alt="스크린샷 2024-07-26 15 19 21" src="https://github.com/user-attachments/assets/f853205a-8660-4e00-a903-eef43a235585"> |![Upbit](https://github.com/jbljw02/JeayBit/assets/125800649/f015f2eb-6b86-48e0-9722-11749244d6c3)|

<br>

## 2. 프로젝트 구조도

### 1) 화폐 정보 불러오기
![화폐 불러오기](https://github.com/user-attachments/assets/4c1f9b3b-a005-471a-bf5a-3eb95b4e7f1c)

### 2) 매수 및 매도
![화폐 거래_1](https://github.com/user-attachments/assets/eeae0d76-2219-48ff-a387-06408268ec44)
![화폐 거래_2](https://github.com/user-attachments/assets/df3c1607-43b9-48dc-8268-50fb6f9f669c)

<br>

## 3. 화면 구성 및 주요 기능

### 1) 회원가입
- 유효성 검사(이메일과 비밀번호의 형식)를 통과해야 회원가입이 가능합니다. <br>
- 중복된 이메일이 아니어야 합니다.

|회원가입|
|:---:|
|![회원가입](https://github.com/user-attachments/assets/c1e6fbed-4314-41a7-bcd2-301b7f86f67d)|

### 2) 로그인
- ID와 비밀번호가 DB의 값과 일치하면 로그인에 성공합니다.
- 로그인에 성공하면 메인화면으로 이동합니다.

|로그인|
|:---:|
|![로그인](https://github.com/user-attachments/assets/4cf6bfc1-4f4d-4d8d-bcef-aae48f69e9a7)|

### 3) 화폐 리스트, 호가/체결내역, 차트
- 화폐의 정보는 주기적으로 갱신됩니다.
- 우측 : 화폐 리스트에서 화폐 정렬/검색 및 관심 화폐 추가가 가능하며, 선택한 화폐에 따라 다른 영역이 상호작용합니다.
- 중앙 : 선택한 화폐의 호가 내역과 체결 내역을 확인할 수 있습니다.
- 좌측 : 선택한 화폐에 대한 차트를 분/시간/일 단위로 확인할 수 있습니다.

|화폐 리스트, 호가/체결내역, 차트|
|:---:|
|![리스트, 호가:체결내역, 차트](https://github.com/user-attachments/assets/16d60113-0573-44ff-b8fe-78f048428962)|

### 4) 입금 및 출금
- 사용자가 원하는 금액만큼 입금 및 출금이 가능합니다. 
- 1회의 입금 및 출금에 제한액이 있습니다.

|입금 및 출금|
|:---:|
|![입금 및 출금](https://github.com/user-attachments/assets/85debc52-5a32-469c-9948-fee88f03e591)|

### 5) 화폐 거래, 거래 내역
- 매수 및 매도를 할 때 호가와 일치하는 가격 혹은 시장가로 요청하면 즉시 거래가 체결됩니다.
- 거래가 체결되면 보유 화폐의 수량이 늘어나며 거래내역에 추가됩니다.
- (1) - 호가와 거래 요청가가 일치하지 않는다면 거래가 체결되지 않습니다. 미체결 거래는 Celery에 의해 주기적으로 호가와 일치하는지 비교됩니다.
- (2) - 일치한다면 거래를 체결시키고 웹 소켓을 통해 클라이언트에게 거래가 체결됐음을 알립니다.
- (3) - 체결된 거래들은 '거래내역'에서 확인할 수 있습니다. 미체결 거래에 대한 주문은 취소할 수 있습니다.
  
|(1) 매수|
|:---:|
|![화폐 매수](https://github.com/user-attachments/assets/9b04d643-1ab1-4e43-b3b6-82fecb526f2f)|


|(2) 거래 체결 알림|
|:---:|
|<img width="1708" alt="스크린샷 2024-07-26 23 38 31" src="https://github.com/user-attachments/assets/8178e435-c02d-48b9-b371-871e7b2ef27a">|

  
|(3) 매도|
|:---:|
|![화폐 매도](https://github.com/user-attachments/assets/94d217e9-4a44-4d8e-bf4f-9d89f420e135)|
