variable "zone_id" {
  description = "The ID of the Route 53 hosted zone."
  type        = string
}

variable "record_name" {
  description = "The name of the DNS record."
  type        = string
}

variable "record_type" {
  description = "The type of the DNS record (e.g., A, CNAME, TXT)."
  type        = string
}

variable "record_ttl" {
  description = "The TTL (time to live) of the DNS record."
  type        = number
  default     = 300
}
