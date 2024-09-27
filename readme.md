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
Устанавливаем бинарники atl:V
```bash
pnpm dev:install
```
Поднимаем докер с БД
```bash
pnpm dev:docker
```

Прогоняем миграции
```bash
pnpm dev:migrate:up
```

Поднимаем CEF, доступен на: ``127.0.0.1:5173``
```bash
pnpm web:serve
```
Запускаем сервер
```bash
pnpm dev
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