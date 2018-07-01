# Dockerfile for the go backend application
#
# docker build -t verath/archipelago-backend .

FROM golang:1.10-alpine

COPY *.go /go/src/github.com/verath/archipelago/
COPY lib /go/src/github.com/verath/archipelago/lib/
COPY vendor /go/src/github.com/verath/archipelago/vendor/

RUN go install github.com/verath/archipelago

RUN rm -rf /go/src

EXPOSE 8080

ENTRYPOINT ["archipelago"]
