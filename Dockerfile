FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

RUN echo "inet4_only = on" >> /etc/wgetrc
ENV MAVEN_OPTS="-Djava.net.preferIPv4Stack=true"

# Copy các file cấu hình Maven trước để tận dụng Docker Cache
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn
RUN chmod +x mvnw

RUN ./mvnw dependency:go-offline -B

COPY src src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app

RUN mkdir -p /app/logs
VOLUME ["/app/logs"]

# Copy file .jar từ giai đoạn Build sang
COPY --from=build /app/target/*.jar app.jar

# Mở cổng 8082
EXPOSE 8082

# Tối ưu hóa JVM RAM cho container
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
