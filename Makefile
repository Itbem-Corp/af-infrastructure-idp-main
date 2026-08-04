## ***************        Example      *************** ##

## make ${project-environment} idp ${project-deploy-type} ${project-prefix} ${project-domain} ${project-region} ${project-aws-account}
## ${project-environment} = This refers to the project environment ( Ex: dev, qa, staging, production ) ( Command word 1 )
## ${project-deploy-type} = This refers to the deployment type ( Ex: deploy and deploy-local ) ( Command word 3 )
## ${project-prefix} = This refers to the project prefix in AWS ( Ex: We recommend use only 3 o 4 words ) ( Command word 4 )
## ${project-domain} = This refers to the project domain in AWS ( Ex: Verify it on AWS Route53 ) ( Command word 5 )
## ${project-region} = This refers to the project default region in AWS ( Ex: Verify it on AWS ) ( Command word 6 )
## ${project-aws-account} = This refers to the client aws id account ( Ex: Verify it on AWS ) ( Command word 7 )
## ${root-user-password} = This refers to the root user password ( Ex: Verify the Root User Password ) ( Command word 8 )
## ${project-google-account-id} = This refers to the client google client id account ( Ex: Verify it on Google Cloud Client ID is gonna be used ) ( Command word 9 )
## EXAMPLE COMMANDS ##
## make dev idp deploy msts manastocks.com us-east-2 746297070679
## make dev idp deploy-local msts manastocks.com us-east-2 746297070679

## **************** General Variables **************** ##
arg1 := $(word 1,$(MAKECMDGOALS))
arg2 := $(word 2,$(MAKECMDGOALS))
arg3 := $(word 3,$(MAKECMDGOALS))
arg4 := $(word 4,$(MAKECMDGOALS))
arg5 := $(word 5,$(MAKECMDGOALS))
arg6 := $(word 6,$(MAKECMDGOALS))
arg7 := $(word 7,$(MAKECMDGOALS))
arg8 := $(word 8,$(MAKECMDGOALS))
arg9 := $(word 9,$(MAKECMDGOALS))

## ********** Environments where it can run ********** ##
.PHONY: $(word 1,$(MAKECMDGOALS))

.PHONY: $(word 2,$(MAKECMDGOALS))

.PHONY: $(word 4,$(MAKECMDGOALS))

.PHONY: $(word 5,$(MAKECMDGOALS))

.PHONY: $(word 6,$(MAKECMDGOALS))

.PHONY: $(word 7,$(MAKECMDGOALS))

.PHONY: $(word 8,$(MAKECMDGOALS))

.PHONY: $(word 9,$(MAKECMDGOALS))

## ************** Variables by Project *************** ##
export PROJECT_PREFIX=$(arg4)
export LOCAL_DOMAIN=$(arg5)
export REGION_ACCOUNT=$(arg6)
export AWS_ACCOUNT=$(arg7)
export PROJECT_ENVIRONMENT=$(arg1)
export ROOT_USER_PASSWORD ?= $(arg8)
export GOOGLE_OAUTH_CLIENT_ID ?= $(arg9)

ifeq ($(PROJECT_ENVIRONMENT), prod)
export PROJECT_DEPLOYMENT_PRODUCTION_TYPE=$(PROJECT_ENVIRONMENT)
endif

ifeq ($(arg3), deploy)
export PROJECT_DEPLOYMENT_TYPE=$(arg3)
endif

export AWS_DEFAULT_REGION=$(REGION_ACCOUNT)
export CDK_DEFAULT_ACCOUNT=$(AWS_ACCOUNT)
export CDK_DEFAULT_REGION=$(AWS_DEFAULT_REGION)
export SES_ARN=arn:aws:ses:$(AWS_DEFAULT_REGION):$(AWS_ACCOUNT):identity

export PROJECT_DOMAIN=$(LOCAL_DOMAIN)
export PROJECT_PREFIX_EMAIL=$(if $(PROJECT_DEPLOYMENT_PRODUCTION_TYPE),info,info-$(PROJECT_ENVIRONMENT))
export PROJECT_SES_ARN=$(SES_ARN)/$(PROJECT_PREFIX_EMAIL)@$(PROJECT_DOMAIN)
export PROJECT_EMAIL=$(PROJECT_PREFIX_EMAIL)@$(PROJECT_DOMAIN)
export PROJECT_EMAIL_DOMAIN=$(PROJECT_DOMAIN)
export PROJECT_PROFILE=$(PROJECT_PREFIX)-$(PROJECT_ENVIRONMENT)
export STACK_NAME=Cdk$(PROJECT_PREFIX)-idp-$(PROJECT_ENVIRONMENT)Stack

## ************ Local Environment ************* ##

$(eval DOMAIN:=$(PROJECT_DOMAIN))
$(eval EMAIL:=$(PROJECT_EMAIL))
$(eval SES_ARN:=$(PROJECT_SES_ARN))

clean:
	rm -rf cdk.out
deploy:
	npm run build
	npx cdk synth --region $(AWS_DEFAULT_REGION) --require-approval never    
	npx cdk deploy $(STACK_NAME) --region $(AWS_DEFAULT_REGION) --require-approval never --parameters "$(STACK_NAME):RootUserPassword=$${ROOT_USER_PASSWORD}"
deploy-local:
	npm run build
	npx cdk synth --region $(AWS_DEFAULT_REGION) --profile $(PROJECT_PROFILE)
	npx cdk deploy $(STACK_NAME) --region $(AWS_DEFAULT_REGION) --profile $(PROJECT_PROFILE) --parameters "$(STACK_NAME):RootUserPassword=$${ROOT_USER_PASSWORD}"
