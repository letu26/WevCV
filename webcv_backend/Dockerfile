# stage 1: build
FROM eclipse-temurin:17-jdk AS build

WORKDIR /app

COPY . .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests


# stage 2: run
FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

CMD ["java", "-Xmx400m", "-Xms256m", "-jar", "app.jar"]
