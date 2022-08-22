deno = $$HOME/.deno/bin/deno
flags = --allow-net --allow-read --allow-write --reload --unstable -q

compile:
	$(deno) run $(flags) ./scripts/compile.js

copy_files:
	cp ./install/install.sh ./_dist

dev:
	$(deno) run $(flags) https://deno.land/std@0.70.0/http/file_server.ts

install_deno:
	curl -fsSL https://deno.land/x/install/install.sh | sh

netlify: install_deno compile copy_files

test:
	$(deno) test $(flags) .
