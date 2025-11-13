# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e3]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - heading "로그인" [level=1] [ref=e7]
        - paragraph [ref=e8]: 무드 다이어리에 오신 것을 환영합니다
      - generic [ref=e9]:
        - generic [ref=e10]:
          - generic [ref=e11]: 이메일
          - textbox "이메일" [ref=e12]:
            - /placeholder: 이메일을 입력해주세요
        - generic [ref=e13]:
          - generic [ref=e14]: 비밀번호
          - textbox "비밀번호" [ref=e15]:
            - /placeholder: 비밀번호를 입력해주세요
        - button "로그인" [disabled] [ref=e16]
      - generic [ref=e17]:
        - generic [ref=e18]: 계정이 없으신가요?
        - link "회원가입" [ref=e19] [cursor=pointer]:
          - /url: /auth/signup
  - alert [ref=e20]
```