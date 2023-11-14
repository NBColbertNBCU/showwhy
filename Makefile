BREW_INSTALLED := $(shell which brew 2> /dev/null)
PODMAN_INSTALLED := $(shell which podman 2> /dev/null)
PODMAN_RUNNING := $(shell podman machine inspect 2>&1)

setup.homebrew:
ifndef BREW_INSTALLED
	@echo "Homebrew not found. Installing now."
	bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)";
endif
	@echo "Homebrew already installed."
	@exit 0;

podman.install: setup.homebrew
ifndef PODMAN_INSTALLED
	@echo "podman not found. Installing now."
	bash -c "$(brew install podman)";
	@podman machine init --cpus 4 --memory 4096 --disk-size 50
endif
	@echo "podman already installed."
	@exit 0;

podman.init: podman.install
	@podman machine init --cpus 4 --memory 4096 --disk-size 50

podman.start:
	@podman machine start 
	@podman system connection default podman-machine-default-root

.PHONY: setup
setup: podman.init

run: podman.start
	podman-compose up

cleanup: 
	@podman container stop -a; echo "y"
	@podman container prune; echo "y"; podman container prune; echo "y"
	@podman machine $(PODMAN_MACHINE_NAME) stop
