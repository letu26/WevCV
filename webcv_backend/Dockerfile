# ---------- BUILD STAGE ----------
FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app
COPY . .

RUN mvn clean package -DskipTests


# ---------- RUNTIME STAGE ----------
FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

COPY . .

# build project
RUN ./mvnw clean package -DskipTests

# install playwright browsers
RUN ./mvnw exec:java \
    -Dexec.mainClass=com.microsoft.playwright.CLI \
    -Dexec.args="install chromium"

EXPOSE 8080

CMD ["java","-jar","target/app.jar"]