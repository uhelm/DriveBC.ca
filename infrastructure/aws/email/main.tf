variable "from_domain" {
  default = "drivebc.ca"
}
variable "configuration_set_name" {
  default = "DRIVEBC"
}

resource "aws_ses_domain_identity" "ms" {
  domain = "${var.from_domain}"
}
resource "aws_ses_configuration_set" "config_set" {

  name = "${var.configuration_set_name}" #"config_set"
  reputation_metrics_enabled = true # Amazon CloudWatch metric. The default value is false
  sending_enabled = true # email sending is enabled or disabled for the configuration set. The default value is true.
  
  delivery_options {
    tls_policy = "Require"  #If the value is Optional, messages can be delivered in plain text if a TLS connection can't be established. 
  }

  tracking_options {
    custom_redirect_domain = var.custom_redirect_domain #   "sub.example.com"
  }

}
resource "aws_ses_domain_mail_from" "custom_mail_from" {
  count                  = 1
  domain                 = join("", aws_ses_domain_identity.ses_domain[*].domain)
  mail_from_domain       = "${one(var.from_subdomain)}.${join("", aws_ses_domain_identity.ses_domain[*].domain)}"
  behavior_on_mx_failure = "UseDefaultValue"
}
