variable "name" {
  type = string
}

variable "create_bucket" {
  type    = bool
  default = false
}

variable "bucket_policy" {
  type    = string
  default = null
}
