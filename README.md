# 암호화폐 가상 거래 서비스 'JeayBit'
> JeayBit은 진입장벽이 낮고 경량화된 암호화폐 가상 거래 프로그램입니다. <br>
> 기존의 응답시간이 길고 복잡한 암호화폐 거래소들과는 달리, 필수적인 기능들만을 채택하여 개발한 트레이딩 뷰입니다. <br>
> 화폐 거래는 실제 거래가 아닌 임의의 가상 환경에서 진행됩니다. <br>
  
<br>

## 1. 프로젝트 개요

### 개발 기간
> 2023.08.28 - 2023.12.05 <br>

### 인원 구성
> 이진우(1인)

### 기술

|Environment|Frontend|Backend|Database|Deployment|API|
|:---:|:---:|:---:|:---:|:---:|:---:|
|![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white) ![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)|![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)|![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white)|![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)|![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white) ![Netlify](https://img.shields.io/badge/netlify-%23000000.svg?style=for-the-badge&logo=netlify&logoColor=#00C7B7)|![aa](https://github.com/jbljw02/JeayBit/assets/125800649/f015f2eb-6b86-48e0-9722-11749244d6c3)|

<br>

## 2. 프로젝트 구조도

### 1) 화폐 정보 불러오기
<img width="1180" alt="스크린샷 2024-01-07 20 19 08" src="https://github.com/jbljw02/JeayBit/assets/125800649/675034c9-737f-49b1-bee8-28329286c283">

### 2) 매수 및 매도
<img width="951" alt="스크린샷 2024-01-07 20 21 21" src="https://github.com/jbljw02/JeayBit/assets/125800649/4565ad3c-3997-4cbd-be5e-987b633b7dd5">

<br>

## 3. 화면 구성 및 주요 기능

### 1) 회원가입
- 유효성 검사(이메일과 비밀번호의 형식)를 통과해야 회원가입이 가능합니다. <br>
- 중복된 이메일이 아니어야 합니다.

|회원가입|
|:---:|
|![회원가입](https://github.com/jbljw02/JeayBit/assets/125800649/9eb11fe4-d99d-4b94-8f9d-930f900ea9f0)|

### 2) 로그인
- ID와 비밀번호가 DB의 값과 일치하면 로그인에 성공합니다.
- 로그인에 성공하면 메인화면으로 이동합니다.

|로그인|
|:---:|
|![로그인](https://github.com/jbljw02/JeayBit/assets/125800649/779b682f-d705-41a4-a120-c1ce9101d9a4)|

### 3) 화폐 리스트, 호가/체결내역, 차트
- 화폐의 정보는 1초마다 갱신됩니다.
- 우측 : 화폐 리스트에서 검색 및 관심 화폐 추가가 가능하며, 선택한 화폐에 따라 다른 컴포넌트가 상호작용합니다.
- 중앙 : 선택한 화폐의 호가 내역과 체결 내역을 확인할 수 있습니다.
- 좌측 : 선택한 화폐에 대한 차트를 분/시간/일 단위로 확인할 수 있습니다.

|화폐 리스트, 호가/체결내역, 차트|
|:---:|
|![전체적인-시연](https://github.com/jbljw02/JeayBit/assets/125800649/f890ccef-f165-4480-a786-ee5f97bda80c)|

### 4) 입금 및 출금
- 사용자가 원하는 금액만큼 입금 및 출금이 가능합니다. 
- 1회의 입금 및 출금에 제한액이 있습니다.

|입금 및 출금|
|:---:|
|![입출금-및-잔고](https://github.com/jbljw02/JeayBit/assets/125800649/93be94d6-80d7-41bb-a66b-d3ba5e70349e)|

### 5) 매수 및 매도, 주문취소
- 매수 및 매도를 할 때 호가와 일치하는 가격으로 요청하면 즉시 거래가 체결됩니다.
- 거래가 체결되면 보유 화폐의 수량이 늘어나며 거래내역에 추가됩니다.
- 그러나, 호가와 거래 요청가가 일치하지 않는다면 거래가 체결되지 않습니다.
- 체결되지 않은 거래는 로컬 스토리지에 남아 화폐의 값이 갱신될 때마다 호가와 거래 요청가를 비교합니다.
- 미체결 거래는 주문 취소가 가능합니다.

|매수 및 매도, 주문취소|
|:---:|
|![매수_-매도-및-거래내역](https://github.com/jbljw02/JeayBit/assets/125800649/a399b1c6-515e-4c2b-96b1-78934bf95978)|
