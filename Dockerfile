# Dockerfile for the go backend application
#
# docker build -t verath/archipelago-backend .

# BUILD stage
FROM golang:1.13 as builder
WORKDIR /app
ENV GO111MODULE=on
ENV GOOS=linux
ENV CGO_ENABLED=0
# Resolve dependencies
COPY go.mod .
COPY go.sum .
RUN go mod download
# Build
COPY *.go .
COPY lib ./lib
RUN go build -a -v

# APP stage
FROM alpine:latest
EXPOSE 8080
WORKDIR /root/
RUN apk update && apk add ca-certificates && rm -rf /var/cache/apk/*
COPY --from=builder /app/archipelago .
ENTRYPOINT ["./archipelago"]
