#!/bin/sh
# Copyright 2020 Hyperspaces. All rights reserved. MIT license.

name="hyperspaces"

bashrc="$HOME/.bashrc"
zsh="$HOME/.zshrc"

deno_bin_dir=".deno/bin"
deno_dir="$HOME/$deno_bin_dir"
deno_bin="$deno_dir/deno"

#hs_url="https://code.hyperspaces.app/cli.js"
hs_url="$HOME/Sites/hyperspaces/cli/index.js"

path="export PATH=\"\$HOME/$deno_bin_dir:\$PATH\""

install_hyperspaces ()
{
  $deno_bin install --allow-env --allow-net --allow-read --allow-run --allow-write --unstable -f --name $name -q $hs_url
  $name post_install

  echo "\nRun $(tput setaf 6)$name help$(tput sgr0) to get started\n"
}

install_deno ()
{
  if command -v $deno_bin >/dev/null; then
    echo ""
  else
    echo ""

    curl -fsSL https://deno.land/x/install/install.sh | sh >/dev/null

    echo "$path" >> $zsh; . $zsh
    echo "$path" >> $bashrc; . $bashrc
  fi
}

install_deno
install_hyperspaces
