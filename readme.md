### Requirements
``node >= 20``
``docker``

### Установка
```bash
npm i -g pnpm
```
```bash
pnpm i
```
```bash
copy .env.example .env
```

### Dev 
```bash
pnpm web:serve
```
```bash
pnpm dev:docker
```
### Production 
Мониторинг опционален
```bash
pnpm monitoring
```
```bash
pnpm build-docker
```
Enjoy at ``:7788``