# 📋 SUBMISSION CHECKLIST - Liverpool Automation Challenge

**Fecha:** 26/07/2026  
**Proyecto:** liverpool-automation-challenge  
**Versión:** 1.0.0  
**Framework:** Playwright Test v1.55.0 + TypeScript v5.9.2  

---

## ✅ MAPEO: Requisitos → Archivos Implementados

### PARTE 1: E2E UI Automation
**Requisito:** Automatizar flujo de compra en Liverpool (search, filter, sort, extract top 5, print)

| Tarea | Archivo | Implementación | Estado |
|-------|---------|-----------------|--------|
| Navegar al sitio | `src/pages/liverpoolSearchPage.ts` | `gotoHome()` método + `dismissCommonPopups()` | ✅ |
| Buscar "playstation 5" | `src/pages/liverpoolSearchPage.ts` | `search(term)` con fallback selectors | ✅ |
| Filtrar por color White | `src/pages/liverpoolSearchPage.ts` | `filterByWhiteColor()` con estrategia de fallback | ✅ |
| Ordenar por menor precio | `src/pages/liverpoolSearchPage.ts` | `sortByLowestPrice()` robusto | ✅ |
| Extraer top 5 productos (nombre + precio) | `src/pages/liverpoolSearchPage.ts` | `getTopProducts(5)` con parsing | ✅ |
| Imprimir a consola | `tests/e2e/liverpool.spec.ts` | `console.log()` en Step 4 | ✅ |
| **PÁGINA PRINCIPAL** | `src/pages/liverpoolSearchPage.ts` | **Page Object Model (POM)** | ✅ |

**Archivos clave:**
```
src/
├── pages/
│   └── liverpoolSearchPage.ts      (170+ líneas, 8 métodos públicos/privados)
├── types/
│   └── product.ts                  (Interface Product)
└── utils/
    └── productParser.ts            (complementario)

tests/
└── e2e/
    └── liverpool.spec.ts           (Steps 1-4 de PARTE 1)
```

---

### PARTE 2: Service Interception & Validation
**Requisito:** Interceptar respuestas API, parsear, validar UI vs API (≥3 de 5 coinciden)

| Tarea | Archivo | Implementación | Estado |
|-------|---------|-----------------|--------|
| Interceptar respuestas JSON (XHR/Fetch) | `tests/e2e/liverpool.spec.ts` | `page.on('response', ...)` listener | ✅ |
| Parsear JSON complejo | `src/utils/productParser.ts` | `walk()` + `extractProductsFromResponse()` | ✅ |
| Extraer productos de payload | `src/utils/productParser.ts` | Heurística de búsqueda por keywords | ✅ |
| Comparar UI vs API | `src/utils/productParser.ts` | `productsMatchByNameAndPrice()` | ✅ |
| Assert ≥3 de 5 coinciden | `tests/e2e/liverpool.spec.ts` | `expect(matches.length).toBeGreaterThanOrEqual(3)` | ✅ |
| Log discrepancias | `tests/e2e/liverpool.spec.ts` | Console logging de mismatches | ✅ |
| Formateo de output | `src/utils/productParser.ts` | `formatProductForLog()` función | ✅ |

**Archivos clave:**
```
src/utils/
└── productParser.ts               (250+ líneas)
    ├── normalizeName()            (normalización)
    ├── toNumber()                 (parsing de precios)
    ├── pickStringField()          (extracción de nombres)
    ├── pickPriceField()           (extracción de precios, recursive)
    ├── walk()                     (traversal de JSON)
    ├── extractProductsFromResponse() (orquestación)
    ├── productsMatchByNameAndPrice() (comparación)
    └── formatProductForLog()      (formatting)

tests/e2e/
└── liverpool.spec.ts             (Step 5 - Validate)
```

---

### PARTE 3: Reporting & CI/CD
**Requisito:** HTML Reports, GitHub Actions, Screenshots/Videos on failure

| Tarea | Archivo | Implementación | Estado |
|-------|---------|-----------------|--------|
| Configurar reporter HTML | `playwright.config.ts` | `reporter: [['html']]` | ✅ |
| Screenshots en fallo | `playwright.config.ts` | `screenshot: 'only-on-failure'` | ✅ |
| Video en fallo | `playwright.config.ts` | `video: 'retain-on-failure'` | ✅ |
| Trace en fallo | `playwright.config.ts` | `trace: 'retain-on-failure'` | ✅ |
| GitHub Actions workflow | `.github/workflows/test.yml` | CI pipeline con 6 steps | ✅ |
| Instalación de deps en CI | `.github/workflows/test.yml` | `npm ci` step | ✅ |
| Instalación de navegadores | `.github/workflows/test.yml` | `npx playwright install --with-deps chromium` | ✅ |
| Ejecución headless en CI | `.github/workflows/test.yml` | `npm test` step | ✅ |
| Subir artifacts | `.github/workflows/test.yml` | `upload-artifact` step con reporte | ✅ |

**Archivos clave:**
```
.github/workflows/
└── test.yml                       (GitHub Actions pipeline)

playwright.config.ts               (Configuración con reporters)

node_modules/.ms-playwright/       (Chromium descargado)
```

---

### PARTE 4: Test Strategy Document
**Requisito:** Documento ~1 página respondiendo 4 preguntas sobre testing

| Pregunta | Sección | Implementación | Estado |
|----------|---------|-----------------|--------|
| ¿Qué NO automatizar? | "What Not to Automate" | Visual-only CSS, third-party popups | ✅ |
| ¿Cómo manejar CAPTCHA? | "CAPTCHA & Bot Detection" | Disable en test env, use mocks | ✅ |
| Riesgos de flakiness | "Flakiness Mitigation" | Fallback selectors, explicit waits, retries | ✅ |
| Escalado a 50+ suites | "CI Scalability" | Tagging, sharding, data controls | ✅ |

**Archivo clave:**
```
TEST_STRATEGY.md                   (1 página, ~800 palabras)
```

---

## 📦 Estructura Completa del Proyecto

```
liverpool-automation-challenge/
├── .github/
│   └── workflows/
│       └── test.yml                    ← PARTE 3: CI/CD
├── src/
│   ├── pages/
│   │   └── liverpoolSearchPage.ts      ← PARTE 1: Page Object
│   ├── types/
│   │   └── product.ts                  ← Data structure
│   └── utils/
│       └── productParser.ts            ← PARTE 2: Parsing & Matching
├── tests/
│   └── e2e/
│       └── liverpool.spec.ts           ← PARTE 1 + PARTE 2: Main Test
├── .gitignore                          ✅
├── package.json                        ✅ (30 packages installed)
├── package-lock.json                   ✅ (locked versions)
├── playwright.config.ts                ← PARTE 3: Reporter config
├── README.md                           ✅ (Setup instructions)
├── TEST_STRATEGY.md                    ← PARTE 4: Strategy document
├── tsconfig.json                       ✅ (TypeScript config)
└── node_modules/                       ✅ (Playwright + deps)
    └── .ms-playwright/
        └── chromium-151/              ← Browser downloaded
```

---

## 🚀 SUBMISSION INSTRUCTIONS

### Paso 1: Verificar Estructura Local
```bash
# En C:\Users\sorianajeral\Downloads\liverpool-automation-challenge

# Verificar que existan todos los archivos requeridos
dir /s /b *.ts *.md *.json *.yml

# Debe ver:
# - tests/e2e/liverpool.spec.ts
# - src/pages/liverpoolSearchPage.ts
# - src/utils/productParser.ts
# - src/types/product.ts
# - .github/workflows/test.yml
# - playwright.config.ts
# - TEST_STRATEGY.md
# - README.md
# - package.json, package-lock.json
```

### Paso 2: Crear Repository en GitHub
```bash
# 1. Ir a https://github.com/new
# 2. Nombre: liverpool-automation-challenge
# 3. Descripción: "E2E Automation Challenge for Liverpool using Playwright"
# 4. Visibility: Public (requerido para que se ejecute GitHub Actions)
# 5. Click "Create repository"
```

### Paso 3: Configurar Git & Push
```bash
# En PowerShell, en la carpeta del proyecto:
cd C:\Users\sorianajeral\Downloads\liverpool-automation-challenge

# Inicializar repo (si no está inicializado)
git init
git config user.name "Tu Nombre"
git config user.email "tu.email@example.com"

# Agregar archivos
git add .

# Commit inicial
git commit -m "Initial commit: Liverpool automation challenge with Playwright"

# Agregar remote (reemplaza con tu URL)
git remote add origin https://github.com/TU_USUARIO/liverpool-automation-challenge.git

# Push a main
git branch -M main
git push -u origin main
```

### Paso 4: Validar GitHub Actions
```
1. Ve a https://github.com/TU_USUARIO/liverpool-automation-challenge/actions
2. Debe ver un workflow corriendo: "test.yml"
3. Espera a que complete (5-10 minutos)
4. Verifica que pase (✅ green check)
5. Haz click en el workflow para ver detalles
6. Ve a "Artifacts" para descargar el reporte HTML
```

### Paso 5: Verificar Entregables en GitHub
```
En la raíz del repo, debe tener VISIBLE:
✅ README.md                     (con instrucciones de setup/run)
✅ TEST_STRATEGY.md              (documento ~1 página)
✅ playwright.config.ts          (con reporters config)
✅ tests/e2e/liverpool.spec.ts   (test principal)
✅ src/pages/liverpoolSearchPage.ts (Page Object)
✅ src/utils/productParser.ts    (Parsing utilities)
✅ .github/workflows/test.yml    (CI pipeline)
✅ package.json                  (con scripts test, test:headed, test:ui)
```

### Paso 6: Preparar Link para Envío
```
Información a enviar a s_fuentesrj@hitss.com:

SUBJECT: "Liverpool Automation Challenge - Submission"

BODY:
---

Estimados,

Adjunto la solución del challenge de automatización Liverpool.

📍 GitHub Repository:
https://github.com/TU_USUARIO/liverpool-automation-challenge

📋 Requisitos Cumplidos:
✅ PARTE 1: E2E UI Automation (search, filter, sort, extract, print)
✅ PARTE 2: Service Interception (JSON parsing, UI vs API validation)
✅ PARTE 3: Reporting & CI (HTML reports, GitHub Actions, artifacts)
✅ PARTE 4: Test Strategy (1-page document with 4 questions)

🔧 Stack:
- Playwright Test v1.55.0
- TypeScript v5.9.2
- Node.js v22+
- GitHub Actions (CI/CD)

🚀 Para ejecutar localmente:
npm install
npm test              # headless mode
HEADED=1 npm test     # with browser visible

📊 Reports:
npm run test:report   # muestra HTML report localmente
GitHub Actions > Artifacts > playwright-report.zip

---
```

---

## 📊 Checklist Final de Entrega

- [ ] **Codebase Completo**
  - [ ] Page Object (liverpoolSearchPage.ts) ✅
  - [ ] Test Principal (liverpool.spec.ts) ✅
  - [ ] Product Parser (productParser.ts) ✅
  - [ ] Types (product.ts) ✅

- [ ] **Documentación**
  - [ ] README.md con instrucciones ✅
  - [ ] TEST_STRATEGY.md documento ✅
  - [ ] Comments en código ✅

- [ ] **Configuración**
  - [ ] playwright.config.ts con reporters ✅
  - [ ] package.json con scripts ✅
  - [ ] tsconfig.json ✅
  - [ ] .gitignore ✅

- [ ] **CI/CD**
  - [ ] .github/workflows/test.yml ✅
  - [ ] Workflow ejecutable en GitHub ✅
  - [ ] Artifacts configurados ✅

- [ ] **Requisitos Funcionales**
  - [ ] Parte 1: UI Automation (5 steps) ✅
  - [ ] Parte 2: Service Interception + Validation ✅
  - [ ] Parte 3: Reporting con screenshots/videos ✅
  - [ ] Parte 4: Test Strategy document ✅

- [ ] **GitHub Repository**
  - [ ] Repositorio público creado
  - [ ] Código pusheado a main
  - [ ] GitHub Actions workflow ejecutado exitosamente
  - [ ] Link listo para envío

---

## 🎯 Requisitos del Challenge Verificados

```
TECHNICAL REQUIREMENTS:
✅ Build an E2E test with Playwright
✅ Automate: navigate → search → filter → sort → extract → print
✅ Use Page Object Model (POM)
✅ Intercept API responses (XHR/Fetch JSON)
✅ Cross-validate UI vs API data
✅ Assert minimum 3 of 5 match
✅ Generate HTML reports
✅ GitHub Actions CI/CD with artifacts
✅ Test strategy document (1 page)
✅ Use TypeScript
✅ Use modern patterns & best practices

BONUS FEATURES (not required):
❌ Visual regression testing
❌ Accessibility testing (axe-core)
❌ Performance assertions
❌ Parallel execution
❌ Data-driven tests
```

---

## 📞 Contacto & Soporte

**Enviado a:** s_fuentesrj@hitss.com

**Adjuntos:**
- GitHub Repository Link
- Este documento (SUBMISSION_CHECKLIST.md)

**En caso de preguntas sobre:**
- Código: Ver comentarios en archivos .ts
- Estrategia: Ver TEST_STRATEGY.md
- Setup: Ver README.md

---

**Estado:** ✅ LISTO PARA ENVÍO

**Última actualización:** 26/07/2026

