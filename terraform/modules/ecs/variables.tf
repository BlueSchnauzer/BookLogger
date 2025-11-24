variable "aws_region" {
  type = string
}

variable "appname" {
  type = string
}

variable "environment" {
  type = string
}

variable "image_name" {
  type = string
}

variable "image_version" {
  type = string
}

variable "cpu" {
  type = number
}

variable "memory" {
  type = number
}

variable "container_port" {
  type = number
}

variable "host_port" {
  type = number
}
