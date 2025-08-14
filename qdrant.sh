#!/bin/bash

# Qdrant Management Script

case "$1" in
  start)
    echo "Starting Qdrant..."
    docker run -d --name qdrant -p 6333:6333 -p 6334:6334 -v "$(pwd)/qdrant_storage:/qdrant/storage" qdrant/qdrant
    echo "Qdrant started on http://localhost:6333"
    ;;
  stop)
    echo "Stopping Qdrant..."
    docker stop qdrant
    docker rm qdrant
    echo "Qdrant stopped"
    ;;
  restart)
    echo "Restarting Qdrant..."
    docker stop qdrant
    docker rm qdrant
    docker run -d --name qdrant -p 6333:6333 -p 6334:6334 -v "$(pwd)/qdrant_storage:/qdrant/storage" qdrant/qdrant
    echo "Qdrant restarted"
    ;;
  status)
    echo "Checking Qdrant status..."
    docker ps | grep qdrant || echo "Qdrant is not running"
    ;;
  logs)
    echo "Showing Qdrant logs..."
    docker logs qdrant
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status|logs}"
    echo ""
    echo "Commands:"
    echo "  start   - Start Qdrant container"
    echo "  stop    - Stop and remove Qdrant container"
    echo "  restart - Restart Qdrant container"
    echo "  status  - Check if Qdrant is running"
    echo "  logs    - Show Qdrant container logs"
    exit 1
    ;;
esac
