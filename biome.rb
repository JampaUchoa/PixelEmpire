@size_y = 40
@size_x = 40
@size   = @size_x * @size_y
@biomes = ["😡","🌏","👿"]
@calls  = 0

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
@queue = []
@queue << [rand(@size_x), rand(@size_y), @biomes.sample, 0]

while @queue.count != 0

tile = @queue.pop
x = tile[0]
y = tile[1]
biome = tile[2]
blocks = tile[3]

@calls += 1
if x >= @size_x || y >= @size_y || x < 0 || y < 0 || @map[y][x] != "0"
  next
end
printmap

if blocks > rand(10)
  biome = @biomes.sample
  @map[y][x] = biome
  blocks = 0
else
  @map[y][x] = biome
  blocks += 1
end

@queue << [x + 1, y, biome, blocks]
@queue << [x - 1, y, biome, blocks]
@queue << [x, y + 1, biome, blocks]
@queue << [x, y - 1, biome, blocks]


end

printmap
p "Calls: #{@calls} - in #{Time.now - start} seconds"
