grep -E "^  " /tmp/gen.log | sed -E 's/^  duplicate: ([a-z0-9-]+) ~ ([a-z0-9-]+).*/\1\n\2/; s/^  ([a-z0-9-]+):.*/\1/' | grep -E "^[a-z0-9-]+$" | sort -u > /tmp/bad.txt
