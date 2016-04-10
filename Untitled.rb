@size_y = 40
@size_x = 40
@biomes = ["😡","🌏","👿"]
@calls = 0

def spread(x, y, biomeType, biomeBlocks) # start on this point and populate based on biome blocks so far
  @calls += 1
  if x >= @size_x || y >= @size_y || x < 0 || y < 0 || @map[y][x] != "0"
    return
  end
  printmap

  biome = biomeType
  blocks = biomeBlocks

  if biomeBlocks > 10
    biome = @biomes.sample
    @map[y][x] = biome
    blocks = 0
  else
    @map[y][x] = biome
    blocks += 1
  end

  spread(x + 1, y, biome, blocks)
  spread(x - 1, y, biome, blocks)
  spread(x, y + 1, biome, blocks)
  spread(x, y - 1, biome, blocks)

end

def printmap
  @size_y.times do |i|
    @size_x.times do |j|
      print " "
      print @map[j][i]
      print " "
    end
    print "\n"
  end
  print "\n"
end


@map = []

biomesNum = @biomes.count

  @size_y.times do |i|
    @map << []
    @size_x.times do |j|
      @map[i] << "0"
    end
  end

start = Time.now
spread(rand(@size_x), rand(@size_y), @biomes.sample, 0) # populate a ramdom place

printmap
p "Calls: #{@calls} - in #{Time.now - start} seconds"
