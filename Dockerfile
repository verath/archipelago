# Dockerfile for the go backend application
#
# docker build -t archipelago-backend .
# Deployed with `fly deploy` (see fly.toml).

# BUILD stage
FROM golang:1.27-alpine AS builder
WORKDIR /app
ENV GOOS=linux
ENV CGO_ENABLED=0
# The image defaults to GOTOOLCHAIN=local; allow fetching the toolchain go.mod
# asks for, so a go.mod bump can't outrun this base image tag.
ENV GOTOOLCHAIN=auto
# Resolve dependencies
COPY go.mod go.sum ./
RUN go mod download
# Build
COPY *.go ./
COPY lib ./lib
RUN go build -trimpath -ldflags="-s -w" -o archipelago .

# APP stage
FROM alpine:3.22
EXPOSE 8080
RUN apk add --no-cache ca-certificates \
    && adduser -D -H -u 10001 archipelago
WORKDIR /app
COPY --from=builder /app/archipelago .
USER archipelago
ENTRYPOINT ["./archipelago"]
