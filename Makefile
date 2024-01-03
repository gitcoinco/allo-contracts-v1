.PHONY: docker-build docker-run docker-kill docker-stop docker-logs docker-deploy-contracts docker-all

docker-all: docker-kill docker-build docker-run docker-deploy-contracts

docker-build:
		docker build . -t allo

docker-run:
		-docker network create allo-devenv-tmp-net
		docker run --network allo-devenv-tmp-net --name localchain --rm -d -p 127.0.0.1:8545:8545/tcp ghcr.io/foundry-rs/foundry:latest "anvil --host 0.0.0.0 --chain-id 313371"

docker-kill:
		-docker kill localchain

docker-stop:
		docker stop localchain

docker-logs:
		docker logs -f localchain

docker-deploy-contracts:
		docker run --network=allo-devenv-tmp-net -e DEV_CHAIN_HOST=localchain allo

