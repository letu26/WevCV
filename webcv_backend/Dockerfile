# ---------- BUILD STAGE ----------
FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

# copy source
COPY . .

# build jar
RUN mvn clean package -DskipTests


# ---------- RUNTIME STAGE ----------
FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# ===== install playwright dependencies =====
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# copy jar từ build stage (⭐ QUAN TRỌNG)
COPY --from=build /app/target/*.jar app.jar

# ===== install playwright chromium =====
RUN java -cp app.jar com.microsoft.playwright.CLI install chromium

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]