kill -9 $(netstat -tlnp | grep 6666 | awk '{print $7}' | awk -F '/' '{print $1}')
kill -9 $(netstat -tlnp | grep 6667 | awk '{print $7}' | awk -F '/' '{print $1}')
