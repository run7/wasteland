#!/usr/bin/python
# -*- coding: utf-8 -*-

from PySide.QtCore import *

def delay(interval):
    ''' 延迟执行函数 '''

    timer = QTimer()
    timer.setInterval(interval)
    timer.setSingleShot(True)

    def wrapper(func):

        args = {}

        def on_timer_timeout():
            return func(args['argv'])

        def inner_wrapper(argv):
            args['argv'] = argv
            timer.start()
            return

        timer.timeout.connect(on_timer_timeout)
        return inner_wrapper

    return wrapper
